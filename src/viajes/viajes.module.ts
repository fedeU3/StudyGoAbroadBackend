import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';
import { ViajesEntity } from './viajes.entity';
import { ViajesPasajerosModule } from '../viajes-pasajeros/viajes-pasajeros.module';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { ProgramasEntity } from '../programas/programas.entity';
import { VuelosEntity } from '../vuelos/vuelos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViajesEntity, PasajerosEntity, ProgramasEntity, VuelosEntity]),
    ViajesPasajerosModule,
  ],
  controllers: [ViajesController],
  providers: [ViajesService],
  exports: [ViajesService],
})
export class ViajesModule { }
