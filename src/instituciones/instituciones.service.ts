import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionesEntity } from './instituciones.entity';

@Injectable()
export class InstitucionesService {
  constructor(
    @InjectRepository(InstitucionesEntity)
    private readonly institucionesRepository: Repository<InstitucionesEntity>,
  ) { }

  getAll() {
    return this.institucionesRepository.find();
  }

  async getById(id: number) {
    const item = await this.institucionesRepository.findOne({
      where: { idInstitucion: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
