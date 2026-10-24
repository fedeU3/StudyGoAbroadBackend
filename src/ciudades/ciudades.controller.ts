import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';

@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) { }

  @Get()
  getAll() {
    return this.ciudadesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.getById(id);
  }
}
