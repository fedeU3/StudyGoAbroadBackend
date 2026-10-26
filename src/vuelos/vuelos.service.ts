import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VuelosEntity } from './vuelos.entity';
import { CreateVueloDto } from './dto/create-vuelo.dto';
import { UpdateVueloDto } from './dto/update-vuelo.dto';
import { VuelosQueryDto } from './dto/vuelos-query.dto';
import { Paginated } from '../common/dto/pagination-query.dto';

@Injectable()
export class VuelosService {
  constructor(
    @InjectRepository(VuelosEntity)
    private readonly vuelosRepository: Repository<VuelosEntity>,
  ) { }

  async getAll(query: VuelosQueryDto): Promise<Paginated<VuelosEntity>> {
    const filtros: FindOptionsWhere<VuelosEntity> = {};
    if (query.desde && query.hasta) {
      filtros.fecha = Between(new Date(query.desde), new Date(query.hasta));
    } else if (query.desde) {
      filtros.fecha = MoreThanOrEqual(new Date(query.desde));
    } else if (query.hasta) {
      filtros.fecha = LessThanOrEqual(new Date(query.hasta));
    }
    if (query.numeroVuelo) filtros.numeroVuelo = ILike(`%${query.numeroVuelo}%`);

    // El aeropuerto puede ser el de origen o el de destino (OR)
    const where = query.idAeropuerto
      ? [
        { ...filtros, idAeropuertoOrigen: query.idAeropuerto },
        { ...filtros, idAeropuertoDestino: query.idAeropuerto },
      ]
      : filtros;

    const [items, total] = await this.vuelosRepository.findAndCount({
      where,
      relations: { aeropuertoOrigen: true, aeropuertoDestino: true },
      order: { fecha: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return { items, total, page: query.page, limit: query.limit };
  }

  async getById(id: number) {
    const item = await this.vuelosRepository.findOne({
      where: { idVuelo: id },
      relations: { aeropuertoOrigen: true, aeropuertoDestino: true },
    });

    if (!item) {
      throw new NotFoundException(`Vuelo con id ${id} no encontrado`);
    }

    return item;
  }

  create(dto: CreateVueloDto) {
    this.validarAeropuertos(dto.idAeropuertoOrigen, dto.idAeropuertoDestino);

    const vuelo = this.vuelosRepository.create({ ...dto, fecha: new Date(dto.fecha) });
    return this.vuelosRepository.save(vuelo);
  }

  async update(id: number, dto: UpdateVueloDto) {
    const item = await this.vuelosRepository.findOneBy({ idVuelo: id });
    if (!item) {
      throw new NotFoundException(`Vuelo con id ${id} no encontrado`);
    }

    const { fecha, ...resto } = dto;
    const vuelo = this.vuelosRepository.merge(item, resto);
    if (fecha) vuelo.fecha = new Date(fecha);
    this.validarAeropuertos(vuelo.idAeropuertoOrigen, vuelo.idAeropuertoDestino);

    return this.vuelosRepository.save(vuelo);
  }

  private validarAeropuertos(origen: number, destino: number) {
    if (origen === destino) {
      throw new BadRequestException('El aeropuerto de origen y el de destino deben ser distintos');
    }
  }
}
