import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasajerosEntity } from './pasajeros.entity';

@Injectable()
export class PasajerosService {
  constructor(
    @InjectRepository(PasajerosEntity)
    private readonly pasajerosRepository: Repository<PasajerosEntity>,
  ) { }

  getAll() {
    return this.pasajerosRepository.find();
  }

  async getById(id: number) {
    const item = await this.pasajerosRepository.findOne({
      where: { idPasajero: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
