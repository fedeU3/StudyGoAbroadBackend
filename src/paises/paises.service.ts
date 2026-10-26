import { Injectable } from '@nestjs/common';
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
    return this.paisesRepository.find({ order: { pais: 'ASC' } });
  }
}
