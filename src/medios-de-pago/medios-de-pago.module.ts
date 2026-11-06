import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediosDePagoEntity } from './medios-de-pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediosDePagoEntity])],
  exports: [TypeOrmModule],
})
export class MediosDePagoModule { }
