import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertosController } from './aeropuertos.controller';
import { AeropuertosService } from './aeropuertos.service';
import { AeropuertosEntity } from './aeropuertos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertosEntity])],
  controllers: [AeropuertosController],
  providers: [AeropuertosService],
  exports: [AeropuertosService],
})
export class AeropuertosModule { }
