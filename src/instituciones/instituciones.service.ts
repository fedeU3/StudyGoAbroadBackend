import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionesEntity } from './instituciones.entity';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { InstitucionesQueryDto } from './dto/instituciones-query.dto';
import { PasajerosService } from '../pasajeros/pasajeros.service';

@Injectable()
export class InstitucionesService {
  constructor(
    @InjectRepository(InstitucionesEntity)
    private readonly institucionesRepository: Repository<InstitucionesEntity>,
    private readonly pasajerosService: PasajerosService,
  ) { }

  getAll(query: InstitucionesQueryDto) {
    const where: FindOptionsWhere<InstitucionesEntity> = {};
    if (!query.incluirBajas) where.estado = 'A';
    if (query.search) where.institucion = ILike(`%${query.search}%`);

    return this.institucionesRepository.find({ where, order: { institucion: 'ASC' } });
  }

  async getById(id: number) {
    const item = await this.institucionesRepository.findOne({
      where: { idInstitucion: id },
      relations: { pais: true, provincia: true, ciudad: true },
    });

    if (!item) {
      throw new NotFoundException(`Institución con id ${id} no encontrada`);
    }

    return item;
  }

  async getPasajeros(id: number, incluirBajas?: boolean) {
    await this.getById(id);
    return this.pasajerosService.getByInstitucion(id, incluirBajas);
  }

  create(dto: CreateInstitucionDto) {
    const institucion = this.institucionesRepository.create({ ...dto, estado: 'A' });
    return this.institucionesRepository.save(institucion);
  }

  async update(id: number, dto: UpdateInstitucionDto) {
    const item = await this.institucionesRepository.findOneBy({ idInstitucion: id });
    if (!item) {
      throw new NotFoundException(`Institución con id ${id} no encontrada`);
    }

    return this.institucionesRepository.save(this.institucionesRepository.merge(item, dto));
  }
}
