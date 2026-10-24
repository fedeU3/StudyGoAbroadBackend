import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasaportesEntity } from './pasaportes.entity';

@Injectable()
export class PasaportesService {
  constructor(
    @InjectRepository(PasaportesEntity)
    private readonly pasaportesRepository: Repository<PasaportesEntity>,
  ) { }

  getAll() {
    return this.pasaportesRepository.find();
  }

  async getById(id: number) {
    const item = await this.pasaportesRepository.findOne({
      where: { idPasaporte: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
