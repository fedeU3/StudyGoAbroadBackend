import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisesEntity } from './paises.entity';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(PaisesEntity)
    private readonly paisesRepository: Repository<PaisesEntity>,
  ) { }

  getAll() {
    return this.paisesRepository.find();
  }

  async getById(id: number) {
    const item = await this.paisesRepository.findOne({
      where: { idPais: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
