import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PasaportesService } from './pasaportes.service';
import { CreatePasaporteDto } from './dto/create-pasaporte.dto';
import { UpdatePasaporteDto } from './dto/update-pasaporte.dto';
import { PorVencerQueryDto } from './dto/por-vencer-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';

// El pasaporte se gestiona siempre a traves de su pasajero
@Controller()
@Auth()
export class PasaportesController {
  constructor(private readonly pasaportesService: PasaportesService) { }

  @Get('pasaportes/por-vencer')
  getPorVencer(@Query() query: PorVencerQueryDto) {
    return this.pasaportesService.getPorVencer(query.dias);
  }

  @Get('pasajeros/:id/pasaporte')
  getByPasajero(@Param('id', ParseIntPipe) id: number) {
    return this.pasaportesService.getByPasajero(id);
  }

  @Post('pasajeros/:id/pasaporte')
  create(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePasaporteDto) {
    return this.pasaportesService.createForPasajero(id, dto);
  }

  @Patch('pasajeros/:id/pasaporte')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePasaporteDto) {
    return this.pasaportesService.updateForPasajero(id, dto);
  }
}
