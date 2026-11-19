import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, DataSource, FindOptionsWhere, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ViajesEntity } from './viajes.entity';
import { ViajesPasajerosService } from '../viajes-pasajeros/viajes-pasajeros.service';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { ProgramasEntity } from '../programas/programas.entity';
import { VuelosEntity } from '../vuelos/vuelos.entity';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { ViajesQueryDto } from './dto/viajes-query.dto';
import { PasajerosViajeDto } from './dto/pasajeros-viaje.dto';
import { Paginated } from '../common/dto/pagination-query.dto';
import { fechaDe } from '../common/validators/formats';

// Tramos del viaje: cada campo solo admite vuelos de su tipo
const TRAMOS = [
  { campo: 'idVueloInternacionalIda', tipo: 'I', nombre: 'internacional de ida' },
  { campo: 'idVueloInternacionalVuelta', tipo: 'I', nombre: 'internacional de vuelta' },
  { campo: 'idVueloNacionalIda', tipo: 'N', nombre: 'nacional de ida' },
  { campo: 'idVueloNacionalVuelta', tipo: 'N', nombre: 'nacional de vuelta' },
] as const;

type CampoVuelo = (typeof TRAMOS)[number]['campo'];
type IdsVuelos = Partial<Record<CampoVuelo, number | null>>;
type VuelosViaje = Record<CampoVuelo, VuelosEntity | null>;

const CON_AEROPUERTOS = { aeropuertoOrigen: true, aeropuertoDestino: true };

const RELACIONES_VUELOS = {
  vueloInternacionalIda: CON_AEROPUERTOS,
  vueloInternacionalVuelta: CON_AEROPUERTOS,
  vueloNacionalIda: CON_AEROPUERTOS,
  vueloNacionalVuelta: CON_AEROPUERTOS,
};

// Para los listados alcanza con los vuelos internacionales (definen salida y regreso)
const RELACIONES_LISTADO = {
  programa: { tipoPrograma: true, paisDestino: true },
  vueloInternacionalIda: true,
  vueloInternacionalVuelta: true,
};

@Injectable()
export class ViajesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ViajesEntity)
    private readonly viajesRepository: Repository<ViajesEntity>,
    private readonly viajesPasajerosService: ViajesPasajerosService,
    @InjectRepository(PasajerosEntity)
    private readonly pasajerosRepository: Repository<PasajerosEntity>,
    @InjectRepository(ProgramasEntity)
    private readonly programasRepository: Repository<ProgramasEntity>,
    @InjectRepository(VuelosEntity)
    private readonly vuelosRepository: Repository<VuelosEntity>,
  ) { }

  async getAll(query: ViajesQueryDto) {
    const filtros: FindOptionsWhere<ViajesEntity> = {};
    if (query.idPrograma) filtros.idPrograma = query.idPrograma;
    if (query.desde && query.hasta) {
      filtros.fechaSalida = Between(query.desde, query.hasta);
    } else if (query.desde) {
      filtros.fechaSalida = MoreThanOrEqual(query.desde);
    } else if (query.hasta) {
      filtros.fechaSalida = LessThanOrEqual(query.hasta);
    }

    const [items, total] = await this.viajesRepository.findAndCount({
      where: filtros,
      relations: RELACIONES_LISTADO,
      order: { fechaSalida: 'ASC', idViaje: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const paginado: Paginated<ReturnType<ViajesService['resumen']>> = {
      items: await this.conCantidadPasajeros(items),
      total,
      page: query.page,
      limit: query.limit,
    };
    return paginado;
  }

  async getByPrograma(idPrograma: number) {
    await this.getPrograma(idPrograma);

    const viajes = await this.viajesRepository.find({
      where: { idPrograma },
      relations: RELACIONES_LISTADO,
      order: { fechaSalida: 'ASC', idViaje: 'ASC' },
    });

    return this.conCantidadPasajeros(viajes);
  }

  async getByPasajero(idPasajero: number) {
    await this.getPasajeros([idPasajero]);

    const viajes = (
      await this.viajesPasajerosService.getViajesDePasajero(idPasajero, { programa: true, ...RELACIONES_VUELOS })
    ).sort((a, b) => b.fechaSalida.localeCompare(a.fechaSalida));

    return this.conCantidadPasajeros(viajes);
  }

  async getById(id: number) {
    const viaje = await this.viajesRepository.findOne({
      where: { idViaje: id },
      relations: {
        programa: { tipoPrograma: true, paisDestino: true, paisExcursion: true },
        ...RELACIONES_VUELOS,
        inscripciones: { pasajero: { pasaporte: true, institucion: true } },
      },
    });

    if (!viaje) {
      throw new NotFoundException(`Viaje con id ${id} no encontrado`);
    }

    const { inscripciones, ...resto } = viaje;
    const pasajeros = inscripciones
      .map(({ pasajero }) => ({
        idPasajero: pasajero.idPasajero,
        nombres: pasajero.nombres,
        apellido: pasajero.apellido,
        dni: pasajero.dni,
        email: pasajero.email,
        estado: pasajero.estado,
        institucion: { idInstitucion: pasajero.institucion.idInstitucion, institucion: pasajero.institucion.institucion },
        pasaporte: pasajero.pasaporte ?? null,
      }))
      .sort((a, b) => a.apellido.localeCompare(b.apellido, 'es') || a.nombres.localeCompare(b.nombres, 'es'));

    return { ...this.resumen(resto as ViajesEntity, pasajeros.length), pasajeros };
  }

  async create(dto: CreateViajeDto) {
    await this.getPrograma(dto.idPrograma);
    const vuelos = await this.validarVuelos(dto);
    const fechaSalida = this.definirFechaSalida(vuelos, dto.fechaSalida);
    const idsPasajeros = dto.idsPasajeros ?? [];
    await this.getPasajeros(idsPasajeros);

    // Viaje y pasajeros en una transaccion: no queda un viaje a medio cargar
    const idViaje = await this.dataSource.transaction(async (manager) => {
      const viaje = await manager.save(
        manager.create(ViajesEntity, {
          idPrograma: dto.idPrograma,
          fechaSalida,
          ...this.idsDe(vuelos),
        }),
      );
      if (idsPasajeros.length) {
        await this.viajesPasajerosService.agregar(viaje.idViaje, idsPasajeros, manager);
      }
      return viaje.idViaje;
    });

    const detalle = await this.getById(idViaje);
    return { ...detalle, advertencias: this.advertenciasPasaporte(detalle) };
  }

  async update(id: number, dto: UpdateViajeDto) {
    const viaje = await this.viajesRepository.findOneBy({ idViaje: id });
    if (!viaje) {
      throw new NotFoundException(`Viaje con id ${id} no encontrado`);
    }

    // undefined = no cambia, null = se quita el vuelo
    const idsFinales: IdsVuelos = {};
    for (const { campo } of TRAMOS) {
      idsFinales[campo] = dto[campo] !== undefined ? dto[campo] : viaje[campo];
    }
    const vuelos = await this.validarVuelos(idsFinales);

    Object.assign(viaje, this.idsDe(vuelos));
    viaje.fechaSalida = this.definirFechaSalida(vuelos, dto.fechaSalida ?? viaje.fechaSalida, dto.fechaSalida);
    await this.viajesRepository.save(viaje);

    const detalle = await this.getById(id);
    return { ...detalle, advertencias: this.advertenciasPasaporte(detalle) };
  }

  async agregarPasajeros(id: number, dto: PasajerosViajeDto) {
    await this.getViaje(id);
    await this.getPasajeros(dto.idsPasajeros);
    await this.viajesPasajerosService.agregar(id, dto.idsPasajeros);

    const detalle = await this.getById(id);
    const agregados = new Set(dto.idsPasajeros);
    return {
      ...detalle,
      advertencias: this.advertenciasPasaporte(detalle, (idPasajero) => agregados.has(idPasajero)),
    };
  }

  async quitarPasajero(id: number, idPasajero: number) {
    await this.getViaje(id);
    await this.viajesPasajerosService.quitar(id, idPasajero);

    return this.getById(id);
  }

  // Datos comunes de un viaje en listados y detalle
  private resumen(viaje: ViajesEntity, cantidadPasajeros: number) {
    return {
      ...viaje,
      // Hasta que se asigna el vuelo internacional de ida, la fecha de salida es tentativa
      fechaSalidaTentativa: viaje.idVueloInternacionalIda === null,
      cantidadPasajeros,
    };
  }

  private async conCantidadPasajeros(viajes: ViajesEntity[]) {
    const porViaje = await this.viajesPasajerosService.contarPorViaje(viajes.map((viaje) => viaje.idViaje));
    return viajes.map((viaje) => this.resumen(viaje, porViaje.get(viaje.idViaje) ?? 0));
  }

  // Con vuelo internacional de ida, la fecha del viaje es la de ese vuelo.
  // Sin ese vuelo, es la fecha tentativa que se cargo.
  private definirFechaSalida(vuelos: VuelosViaje, fechaTentativa?: string, fechaEnviada?: string) {
    const ida = vuelos.idVueloInternacionalIda;
    if (ida) {
      if (fechaEnviada !== undefined) {
        throw new BadRequestException(
          'No se envía fechaSalida si hay vuelo internacional de ida: la fecha del viaje es la de ese vuelo',
        );
      }
      return fechaDe(ida.fecha);
    }
    if (!fechaTentativa) {
      throw new BadRequestException('fechaSalida es obligatoria si no hay vuelo internacional de ida');
    }
    return fechaTentativa;
  }

  // Valida existencia y tipo de cada vuelo, y que cada vuelta sea posterior a su ida
  private async validarVuelos(ids: IdsVuelos): Promise<VuelosViaje> {
    const vuelos = {} as VuelosViaje;
    for (const { campo, tipo, nombre } of TRAMOS) {
      const idVuelo = ids[campo];
      if (idVuelo === undefined || idVuelo === null) {
        vuelos[campo] = null;
        continue;
      }
      const vuelo = await this.vuelosRepository.findOneBy({ idVuelo });
      if (!vuelo) {
        throw new NotFoundException(`Vuelo con id ${idVuelo} no encontrado`);
      }
      if (vuelo.tipoVuelo !== tipo) {
        throw new BadRequestException(
          `El vuelo ${vuelo.numeroVuelo} no se puede asignar como ${nombre}: es ${vuelo.tipoVuelo === 'I' ? 'internacional' : 'nacional'}`,
        );
      }
      vuelos[campo] = vuelo;
    }

    this.validarIdaVuelta(vuelos.idVueloInternacionalIda, vuelos.idVueloInternacionalVuelta, 'internacional');
    this.validarIdaVuelta(vuelos.idVueloNacionalIda, vuelos.idVueloNacionalVuelta, 'nacional');

    return vuelos;
  }

  private validarIdaVuelta(ida: VuelosEntity | null, vuelta: VuelosEntity | null, tipo: string) {
    if (vuelta && !ida) {
      throw new BadRequestException(`No se puede cargar el vuelo ${tipo} de vuelta sin el de ida`);
    }
    if (ida && vuelta && vuelta.fecha <= ida.fecha) {
      throw new BadRequestException(`El vuelo ${tipo} de vuelta tiene que ser posterior al de ida`);
    }
  }

  private idsDe(vuelos: VuelosViaje) {
    const ids = {} as Record<CampoVuelo, number | null>;
    for (const { campo } of TRAMOS) ids[campo] = vuelos[campo]?.idVuelo ?? null;
    return ids;
  }

  // Avisa, sin bloquear, si un pasaporte no va a estar vigente hasta la vuelta
  // (o hasta la salida, si todavia no hay vuelo de vuelta)
  private advertenciasPasaporte(
    detalle: Awaited<ReturnType<ViajesService['getById']>>,
    incluir: (idPasajero: number) => boolean = () => true,
  ) {
    const vuelta = detalle.vueloInternacionalVuelta;
    const ida = detalle.vueloInternacionalIda;
    const referencia = vuelta ? fechaDe(vuelta.fecha) : ida ? fechaDe(ida.fecha) : detalle.fechaSalida;
    const momento = vuelta ? 'antes de la vuelta' : 'antes de la salida';

    return detalle.pasajeros
      .filter((pasajero) => incluir(pasajero.idPasajero))
      .flatMap((pasajero) => {
        const nombre = `${pasajero.nombres} ${pasajero.apellido}`;
        if (!pasajero.pasaporte) return [`${nombre} no tiene pasaporte cargado`];
        if (pasajero.pasaporte.fechaVencimiento < referencia) {
          return [`El pasaporte de ${nombre} vence el ${pasajero.pasaporte.fechaVencimiento}, ${momento} (${referencia})`];
        }
        return [];
      });
  }

  private async getViaje(id: number) {
    const viaje = await this.viajesRepository.findOneBy({ idViaje: id });
    if (!viaje) {
      throw new NotFoundException(`Viaje con id ${id} no encontrado`);
    }

    return viaje;
  }

  private async getPrograma(idPrograma: number) {
    const programa = await this.programasRepository.findOneBy({ idPrograma });
    if (!programa) {
      throw new NotFoundException(`Programa con id ${idPrograma} no encontrado`);
    }

    return programa;
  }

  // Todos tienen que existir y estar activos para sumarse a un viaje
  private async getPasajeros(ids: number[]) {
    if (!ids.length) return [];

    const pasajeros = await this.pasajerosRepository.findBy({ idPasajero: In(ids) });
    const encontrados = new Set(pasajeros.map((pasajero) => pasajero.idPasajero));
    const faltante = ids.find((id) => !encontrados.has(id));
    if (faltante !== undefined) {
      throw new NotFoundException(`Pasajero con id ${faltante} no encontrado`);
    }

    return pasajeros;
  }
}
