import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';
import { ViajesEntity } from './viajes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViajesEntity])],
  controllers: [ViajesController],
  providers: [ViajesService],
  exports: [ViajesService],
})
export class ViajesModule { }
