import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VuelosEntity } from './vuelos.entity';

@Injectable()
export class VuelosService {
  constructor(
    @InjectRepository(VuelosEntity)
    private readonly vuelosRepository: Repository<VuelosEntity>,
  ) { }

  getAll() {
    return this.vuelosRepository.find();
  }

  async getById(id: number) {
    const item = await this.vuelosRepository.findOne({
      where: { idVuelo: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
