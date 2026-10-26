import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ViajesEntity } from './viajes.entity';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { ProgramasEntity } from '../programas/programas.entity';
import { VuelosEntity } from '../vuelos/vuelos.entity';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';

const RELACIONES_VUELOS = {
  vueloInternacional: { aeropuertoOrigen: true, aeropuertoDestino: true },
  vueloNacional: { aeropuertoOrigen: true, aeropuertoDestino: true },
};

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(ViajesEntity)
    private readonly viajesRepository: Repository<ViajesEntity>,
    @InjectRepository(PasajerosEntity)
    private readonly pasajerosRepository: Repository<PasajerosEntity>,
    @InjectRepository(ProgramasEntity)
    private readonly programasRepository: Repository<ProgramasEntity>,
    @InjectRepository(VuelosEntity)
    private readonly vuelosRepository: Repository<VuelosEntity>,
  ) { }

  async getByPasajero(idPasajero: number) {
    await this.getPasajero(idPasajero);

    return this.viajesRepository.find({
      where: { idPasajero },
      relations: { programa: true, ...RELACIONES_VUELOS },
      order: { idViaje: 'DESC' },
    });
  }

  async getByPrograma(idPrograma: number) {
    await this.getPrograma(idPrograma);

    return this.viajesRepository.find({
      where: { idPrograma },
      relations: { pasajero: true, ...RELACIONES_VUELOS },
      select: {
        pasajero: { idPasajero: true, nombres: true, apellido: true, dni: true, email: true, estado: true },
      },
      order: { pasajero: { apellido: 'ASC', nombres: 'ASC' } },
    });
  }

  async getById(id: number) {
    const item = await this.viajesRepository.findOne({
      where: { idViaje: id },
      relations: { pasajero: true, programa: true, ...RELACIONES_VUELOS },
    });

    if (!item) {
      throw new NotFoundException(`Viaje con id ${id} no encontrado`);
    }

    return item;
  }

  // Inscribe al pasajero en un programa con sus vuelos.
  // Un pasajero puede repetir un programa: cada inscripcion es un viaje distinto.
  async create(idPasajero: number, dto: CreateViajeDto) {
    const pasajero = await this.getPasajero(idPasajero);
    await this.getPrograma(dto.idPrograma);
    const vueloInternacional = await this.validarVuelo(dto.idVueloInternacional, 'I');
    if (dto.idVueloNacional) await this.validarVuelo(dto.idVueloNacional, 'N');

    // Un solo INSERT: es atomico, no queda nada a medias
    const viaje = await this.viajesRepository.save(
      this.viajesRepository.create({
        idPasajero,
        idPrograma: dto.idPrograma,
        idVueloInternacional: dto.idVueloInternacional,
        idVueloNacional: dto.idVueloNacional ?? null,
      }),
    );

    return {
      ...(await this.getById(viaje.idViaje)),
      advertencias: await this.advertenciasPasaporte(pasajero, vueloInternacional),
    };
  }

  async update(id: number, dto: UpdateViajeDto) {
    const viaje = await this.viajesRepository.findOneBy({ idViaje: id });
    if (!viaje) {
      throw new NotFoundException(`Viaje con id ${id} no encontrado`);
    }

    if (dto.idVueloInternacional !== undefined) {
      await this.validarVuelo(dto.idVueloInternacional, 'I');
      viaje.idVueloInternacional = dto.idVueloInternacional;
    }
    if (dto.idVueloNacional !== undefined) {
      if (dto.idVueloNacional !== null) await this.validarVuelo(dto.idVueloNacional, 'N');
      viaje.idVueloNacional = dto.idVueloNacional;
    }

    await this.viajesRepository.save(viaje);
    return this.getById(id);
  }

  private async getPasajero(idPasajero: number) {
    const pasajero = await this.pasajerosRepository.findOne({
      where: { idPasajero },
      relations: { pasaporte: true },
    });
    if (!pasajero) {
      throw new NotFoundException(`Pasajero con id ${idPasajero} no encontrado`);
    }

    return pasajero;
  }

  private async getPrograma(idPrograma: number) {
    const programa = await this.programasRepository.findOneBy({ idPrograma });
    if (!programa) {
      throw new NotFoundException(`Programa con id ${idPrograma} no encontrado`);
    }

    return programa;
  }

  // El tipo del vuelo tiene que coincidir con el campo donde se asigna
  private async validarVuelo(idVuelo: number, tipo: 'I' | 'N') {
    const vuelo = await this.vuelosRepository.findOneBy({ idVuelo });
    if (!vuelo) {
      throw new NotFoundException(`Vuelo con id ${idVuelo} no encontrado`);
    }
    if (vuelo.tipoVuelo !== tipo) {
      const campo = tipo === 'I' ? 'internacional' : 'nacional';
      throw new BadRequestException(`El vuelo ${idVuelo} no es ${campo}`);
    }

    return vuelo;
  }

  // Advierte (sin bloquear) si el pasaporte no esta vigente para el vuelo internacional
  private async advertenciasPasaporte(pasajero: PasajerosEntity, vuelo: VuelosEntity) {
    const fechaVuelo = new Date(vuelo.fecha).toISOString().slice(0, 10);
    if (!pasajero.pasaporte) {
      return ['El pasajero no tiene pasaporte cargado'];
    }
    if (pasajero.pasaporte.fechaVencimiento < fechaVuelo) {
      return [`El pasaporte vence el ${pasajero.pasaporte.fechaVencimiento}, antes del vuelo internacional`];
    }

    return [];
  }
}
