import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PasaportesService } from './pasaportes.service';

@Controller('pasaportes')
export class PasaportesController {
  constructor(private readonly pasaportesService: PasaportesService) { }

  @Get()
  getAll() {
    return this.pasaportesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.pasaportesService.getById(id);
  }
}
