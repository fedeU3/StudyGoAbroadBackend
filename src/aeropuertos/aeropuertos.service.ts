import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertosEntity } from './aeropuertos.entity';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';

@Injectable()
export class AeropuertosService {
  constructor(
    @InjectRepository(AeropuertosEntity)
    private readonly aeropuertosRepository: Repository<AeropuertosEntity>,
  ) { }

  getAll() {
    return this.aeropuertosRepository.find({ order: { aeropuerto: 'ASC' } });
  }

  create(dto: CreateAeropuertoDto) {
    return this.aeropuertosRepository.save(this.aeropuertosRepository.create(dto));
  }

  async update(id: number, dto: UpdateAeropuertoDto) {
    const item = await this.aeropuertosRepository.findOneBy({ idAeropuerto: id });
    if (!item) {
      throw new NotFoundException(`Aeropuerto con id ${id} no encontrado`);
    }

    return this.aeropuertosRepository.save(this.aeropuertosRepository.merge(item, dto));
  }
}
