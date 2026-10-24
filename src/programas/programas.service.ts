import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramasEntity } from './programas.entity';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(ProgramasEntity)
    private readonly programasRepository: Repository<ProgramasEntity>,
  ) { }

  getAll() {
    return this.programasRepository.find();
  }

  async getById(id: number) {
    const item = await this.programasRepository.findOne({
      where: { idPrograma: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
