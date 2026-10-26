import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasaportesController } from './pasaportes.controller';
import { PasaportesService } from './pasaportes.service';
import { PasaportesEntity } from './pasaportes.entity';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasaportesEntity, PasajerosEntity])],
  controllers: [PasaportesController],
  providers: [PasaportesService],
  exports: [PasaportesService],
})
export class PasaportesModule { }
