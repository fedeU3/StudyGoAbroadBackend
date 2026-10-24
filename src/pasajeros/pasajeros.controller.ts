import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PasajerosService } from './pasajeros.service';

@Controller('pasajeros')
export class PasajerosController {
  constructor(private readonly pasajerosService: PasajerosService) { }

  @Get()
  getAll() {
    return this.pasajerosService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.pasajerosService.getById(id);
  }
}
