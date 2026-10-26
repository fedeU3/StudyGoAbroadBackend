import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PasajerosService } from './pasajeros.service';
import { CreatePasajeroDto } from './dto/create-pasajero.dto';
import { UpdatePasajeroDto } from './dto/update-pasajero.dto';
import { PasajerosQueryDto } from './dto/pasajeros-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('pasajeros')
@Auth()
export class PasajerosController {
  constructor(private readonly pasajerosService: PasajerosService) { }

  @Get()
  getAll(@Query() query: PasajerosQueryDto) {
    return this.pasajerosService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.pasajerosService.getById(id);
  }

  @Post()
  create(@Body() dto: CreatePasajeroDto) {
    return this.pasajerosService.create(dto);
  }

  // Tambien da de baja: { "estado": "B" }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePasajeroDto) {
    return this.pasajerosService.update(id, dto);
  }
}
