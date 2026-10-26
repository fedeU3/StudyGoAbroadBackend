import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinciasEntity } from './provincias.entity';

@Injectable()
export class ProvinciasService {
  constructor(
    @InjectRepository(ProvinciasEntity)
    private readonly provinciasRepository: Repository<ProvinciasEntity>,
  ) { }

  getAll() {
    return this.provinciasRepository.find({ order: { provincia: 'ASC' } });
  }
}
