import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AeropuertosService } from './aeropuertos.service';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('aeropuertos')
@Auth()
export class AeropuertosController {
  constructor(private readonly aeropuertosService: AeropuertosService) { }

  @Get()
  getAll() {
    return this.aeropuertosService.getAll();
  }

  @Post()
  create(@Body() dto: CreateAeropuertoDto) {
    return this.aeropuertosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAeropuertoDto) {
    return this.aeropuertosService.update(id, dto);
  }
}
