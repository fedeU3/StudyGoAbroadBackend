import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasaportesController } from './pasaportes.controller';
import { PasaportesService } from './pasaportes.service';
import { PasaportesEntity } from './pasaportes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasaportesEntity])],
  controllers: [PasaportesController],
  providers: [PasaportesService],
  exports: [PasaportesService],
})
export class PasaportesModule { }
