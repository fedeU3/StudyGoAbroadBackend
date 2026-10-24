import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AeropuertosService } from './aeropuertos.service';

@Controller('aeropuertos')
export class AeropuertosController {
  constructor(private readonly aeropuertosService: AeropuertosService) { }

  @Get()
  getAll() {
    return this.aeropuertosService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.aeropuertosService.getById(id);
  }
}
