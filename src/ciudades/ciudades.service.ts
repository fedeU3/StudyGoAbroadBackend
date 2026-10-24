import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadesEntity } from './ciudades.entity';

@Injectable()
export class CiudadesService {
  constructor(
    @InjectRepository(CiudadesEntity)
    private readonly ciudadesRepository: Repository<CiudadesEntity>,
  ) { }

  getAll() {
    return this.ciudadesRepository.find();
  }

  async getById(id: number) {
    const item = await this.ciudadesRepository.findOne({
      where: { idCiudad: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
