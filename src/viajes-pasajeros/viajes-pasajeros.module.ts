import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesPasajerosEntity } from './viajes-pasajeros.entity';
import { ViajesPasajerosService } from './viajes-pasajeros.service';

// Sin controller: las rutas viven en /viajes/:id/pasajeros (modulo de viajes)
@Module({
  imports: [TypeOrmModule.forFeature([ViajesPasajerosEntity])],
  providers: [ViajesPasajerosService],
  exports: [ViajesPasajerosService],
})
export class ViajesPasajerosModule { }
