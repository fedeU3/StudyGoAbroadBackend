import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisesController } from './paises.controller';
import { PaisesService } from './paises.service';
import { PaisesEntity } from './paises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaisesEntity])],
  controllers: [PaisesController],
  providers: [PaisesService],
  exports: [PaisesService],
})
export class PaisesModule { }
