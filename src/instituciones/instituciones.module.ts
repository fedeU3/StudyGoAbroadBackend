import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionesController } from './instituciones.controller';
import { InstitucionesService } from './instituciones.service';
import { InstitucionesEntity } from './instituciones.entity';
import { PasajerosModule } from '../pasajeros/pasajeros.module';

@Module({
  imports: [TypeOrmModule.forFeature([InstitucionesEntity]), PasajerosModule],
  controllers: [InstitucionesController],
  providers: [InstitucionesService],
  exports: [InstitucionesService],
})
export class InstitucionesModule { }
