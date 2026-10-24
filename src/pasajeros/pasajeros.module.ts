import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasajerosController } from './pasajeros.controller';
import { PasajerosService } from './pasajeros.service';
import { PasajerosEntity } from './pasajeros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasajerosEntity])],
  controllers: [PasajerosController],
  providers: [PasajerosService],
  exports: [PasajerosService],
})
export class PasajerosModule { }
