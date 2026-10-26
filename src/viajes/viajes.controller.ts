import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller()
@Auth()
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) { }

  @Get('pasajeros/:id/viajes')
  getByPasajero(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getByPasajero(id);
  }

  @Post('pasajeros/:id/viajes')
  create(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateViajeDto) {
    return this.viajesService.create(id, dto);
  }

  @Get('programas/:id/viajes')
  getByPrograma(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getByPrograma(id);
  }

  @Get('viajes/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getById(id);
  }

  @Patch('viajes/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateViajeDto) {
    return this.viajesService.update(id, dto);
  }
}
