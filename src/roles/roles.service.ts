import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) { }

  getAll() {
    return this.rolesRepository.find();
  }

  async getById(id: number) {
    const item = await this.rolesRepository.findOne({
      where: { idRol: id },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }

    return item;
  }
}
