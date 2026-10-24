import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposProgramasController } from './tipos-programas.controller';
import { TiposProgramasService } from './tipos-programas.service';
import { TiposProgramasEntity } from './tipos-programas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiposProgramasEntity])],
  controllers: [TiposProgramasController],
  providers: [TiposProgramasService],
  exports: [TiposProgramasService],
})
export class TiposProgramasModule { }
