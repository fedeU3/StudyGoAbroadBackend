import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PagosEntity } from './pagos.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(PagosEntity)
    private readonly pagosRepository: Repository<PagosEntity>,
  ) { }

  getAll() {
    return this.pagosRepository.find();
  }

  async getById(id: number) {
    const item = await this.pagosRepository.findOne({
      where: { idPago: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
