import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertosEntity } from './aeropuertos.entity';

@Injectable()
export class AeropuertosService {
  constructor(
    @InjectRepository(AeropuertosEntity)
    private readonly aeropuertosRepository: Repository<AeropuertosEntity>,
  ) { }

  getAll() {
    return this.aeropuertosRepository.find();
  }

  async getById(id: number) {
    const item = await this.aeropuertosRepository.findOne({
      where: { idAeropuerto: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
