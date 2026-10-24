import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.tiposProgramasRepository.find();
  }

  async getById(id: number) {
    const item = await this.tiposProgramasRepository.findOne({
      where: { idTipoPrograma: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
