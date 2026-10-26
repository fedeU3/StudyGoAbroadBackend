import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasajerosEntity } from './pasajeros.entity';
import { CreatePasajeroDto } from './dto/create-pasajero.dto';
import { UpdatePasajeroDto } from './dto/update-pasajero.dto';
import { PasajerosQueryDto } from './dto/pasajeros-query.dto';
import { Paginated } from '../common/dto/pagination-query.dto';
import { hoy } from '../common/validators/formats';

// Campos del listado: alergia y dieta solo se muestran en el detalle
const LISTADO_SELECT = {
  idPasajero: true,
  idFactura: true,
  idPasaporte: true,
  idProvincia: true,
  idCiudad: true,
  idInstitucion: true,
  nombres: true,
  apellido: true,
  dni: true,
  fechaNacimiento: true,
  nacionalidad: true,
  domicilio: true,
  email: true,
  estado: true,
  institucion: { idInstitucion: true, institucion: true },
};

@Injectable()
export class PasajerosService {
  constructor(
    @InjectRepository(PasajerosEntity)
    private readonly pasajerosRepository: Repository<PasajerosEntity>,
  ) { }

  async getAll(query: PasajerosQueryDto): Promise<Paginated<PasajerosEntity>> {
    const filtros: FindOptionsWhere<PasajerosEntity> = {};
    if (!query.incluirBajas) filtros.estado = 'A';
    if (query.idInstitucion) filtros.idInstitucion = query.idInstitucion;
    if (query.idProvincia) filtros.idProvincia = query.idProvincia;

    // Con busqueda, cada campo es una alternativa (OR) que conserva los filtros
    const where = query.search
      ? (['apellido', 'nombres', 'dni', 'email'] as const).map((campo) => ({
        ...filtros,
        [campo]: ILike(`%${query.search}%`),
      }))
      : filtros;

    const [items, total] = await this.pasajerosRepository.findAndCount({
      select: LISTADO_SELECT,
      relations: { institucion: true },
      where,
      order: { apellido: 'ASC', nombres: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return { items, total, page: query.page, limit: query.limit };
  }

  // Pasajeros de una institucion, sin alergia ni dieta
  getByInstitucion(idInstitucion: number, incluirBajas = false) {
    return this.pasajerosRepository.find({
      select: LISTADO_SELECT,
      where: { idInstitucion, ...(incluirBajas ? {} : { estado: 'A' }) },
      order: { apellido: 'ASC', nombres: 'ASC' },
    });
  }

  async getById(id: number) {
    const item = await this.pasajerosRepository.findOne({
      where: { idPasajero: id },
      relations: {
        pasaporte: { paisEmisor: true },
        institucion: true,
        provincia: true,
        ciudad: true,
        viajes: { programa: true, vueloInternacional: true, vueloNacional: true },
        pagos: true,
      },
      order: { pagos: { numeroCuota: 'ASC' } },
    });

    if (!item) {
      throw new NotFoundException(`Pasajero con id ${id} no encontrado`);
    }

    return item;
  }

  async create(dto: CreatePasajeroDto) {
    this.validarFechaNacimiento(dto.fechaNacimiento);

    const pasajero = this.pasajerosRepository.create({ ...dto, estado: 'A' });
    return this.pasajerosRepository.save(pasajero);
  }

  async update(id: number, dto: UpdatePasajeroDto) {
    const item = await this.pasajerosRepository.findOneBy({ idPasajero: id });
    if (!item) {
      throw new NotFoundException(`Pasajero con id ${id} no encontrado`);
    }

    if (dto.fechaNacimiento) this.validarFechaNacimiento(dto.fechaNacimiento);

    return this.pasajerosRepository.save(this.pasajerosRepository.merge(item, dto));
  }

  private validarFechaNacimiento(fecha: string) {
    if (fecha > hoy()) {
      throw new BadRequestException('fechaNacimiento no puede ser futura');
    }
  }
}
