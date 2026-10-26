import { Injectable } from '@nestjs/common';
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
    return this.ciudadesRepository.find({ order: { ciudad: 'ASC' } });
  }
}
