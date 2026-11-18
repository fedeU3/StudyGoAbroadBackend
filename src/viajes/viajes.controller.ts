import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { ViajesQueryDto } from './dto/viajes-query.dto';
import { PasajerosViajeDto } from './dto/pasajeros-viaje.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller()
@Auth()
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) { }

  @Get('viajes')
  getAll(@Query() query: ViajesQueryDto) {
    return this.viajesService.getAll(query);
  }

  @Post('viajes')
  create(@Body() dto: CreateViajeDto) {
    return this.viajesService.create(dto);
  }

  @Get('viajes/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getById(id);
  }

  @Patch('viajes/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateViajeDto) {
    return this.viajesService.update(id, dto);
  }

  @Post('viajes/:id/pasajeros')
  agregarPasajeros(@Param('id', ParseIntPipe) id: number, @Body() dto: PasajerosViajeDto) {
    return this.viajesService.agregarPasajeros(id, dto);
  }

  // Excepcion a la baja logica: ViajesPasajeros no tiene Estado, se borra la fila
  @Delete('viajes/:id/pasajeros/:idPasajero')
  quitarPasajero(
    @Param('id', ParseIntPipe) id: number,
    @Param('idPasajero', ParseIntPipe) idPasajero: number,
  ) {
    return this.viajesService.quitarPasajero(id, idPasajero);
  }

  @Get('pasajeros/:id/viajes')
  getByPasajero(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getByPasajero(id);
  }

  @Get('programas/:id/viajes')
  getByPrograma(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getByPrograma(id);
  }
}
