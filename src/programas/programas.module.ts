import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramasController } from './programas.controller';
import { ProgramasService } from './programas.service';
import { ProgramasEntity } from './programas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramasEntity])],
  controllers: [ProgramasController],
  providers: [ProgramasService],
  exports: [ProgramasService],
})
export class ProgramasModule { }
