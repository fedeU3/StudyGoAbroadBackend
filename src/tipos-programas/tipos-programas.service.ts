import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TiposProgramasEntity } from './tipos-programas.entity';

@Injectable()
export class TiposProgramasService {
  constructor(
    @InjectRepository(TiposProgramasEntity)
    private readonly tiposProgramasRepository: Repository<TiposProgramasEntity>,
  ) { }

  getAll() {
    return this.tiposProgramasRepository.find({ order: { tipoPrograma: 'ASC' } });
  }
}
