import { Injectable } from '@nestjs/common';
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
    return this.rolesRepository.find({ order: { rol: 'ASC' } });
  }
}
