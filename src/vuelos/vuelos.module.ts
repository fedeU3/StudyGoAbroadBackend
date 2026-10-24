import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VuelosController } from './vuelos.controller';
import { VuelosService } from './vuelos.service';
import { VuelosEntity } from './vuelos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VuelosEntity])],
  controllers: [VuelosController],
  providers: [VuelosService],
  exports: [VuelosService],
})
export class VuelosModule { }
