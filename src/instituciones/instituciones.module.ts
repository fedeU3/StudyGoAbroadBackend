import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionesController } from './instituciones.controller';
import { InstitucionesService } from './instituciones.service';
import { InstitucionesEntity } from './instituciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InstitucionesEntity])],
  controllers: [InstitucionesController],
  providers: [InstitucionesService],
  exports: [InstitucionesService],
})
export class InstitucionesModule { }
