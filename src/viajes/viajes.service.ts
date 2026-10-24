import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ViajesEntity } from './viajes.entity';

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(ViajesEntity)
    private readonly viajesRepository: Repository<ViajesEntity>,
  ) { }

  getAll() {
    return this.viajesRepository.find();
  }

  async getById(id: number) {
    const item = await this.viajesRepository.findOne({
      where: { idViaje: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
