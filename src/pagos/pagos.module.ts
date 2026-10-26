import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { PagosEntity } from './pagos.entity';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PagosEntity, PasajerosEntity])],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule { }
