import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramasEntity } from './programas.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { ProgramasQueryDto } from './dto/programas-query.dto';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(ProgramasEntity)
    private readonly programasRepository: Repository<ProgramasEntity>,
  ) { }

  getAll(query: ProgramasQueryDto) {
    const where: FindOptionsWhere<ProgramasEntity> = {};
    if (!query.incluirBajas) where.estado = 'A';
    if (query.idTipoPrograma) where.idTipoPrograma = query.idTipoPrograma;
    if (query.idPaisDestino) where.idPaisDestino = query.idPaisDestino;

    return this.programasRepository.find({
      where,
      relations: { tipoPrograma: true, paisDestino: true, paisExcursion: true },
      order: { nombrePrograma: 'ASC' },
    });
  }

  async getById(id: number) {
    const item = await this.programasRepository.findOne({
      where: { idPrograma: id },
      relations: { tipoPrograma: true, paisDestino: true, paisExcursion: true },
    });

    if (!item) {
      throw new NotFoundException(`Programa con id ${id} no encontrado`);
    }

    return item;
  }

  create(dto: CreateProgramaDto) {
    const programa = this.programasRepository.create({ ...dto, estado: 'A' });
    return this.programasRepository.save(programa);
  }

  async update(id: number, dto: UpdateProgramaDto) {
    const item = await this.programasRepository.findOneBy({ idPrograma: id });
    if (!item) {
      throw new NotFoundException(`Programa con id ${id} no encontrado`);
    }

    return this.programasRepository.save(this.programasRepository.merge(item, dto));
  }
}
