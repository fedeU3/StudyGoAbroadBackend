import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VuelosService } from './vuelos.service';

@Controller('vuelos')
export class VuelosController {
  constructor(private readonly vuelosService: VuelosService) { }

  @Get()
  getAll() {
    return this.vuelosService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.vuelosService.getById(id);
  }
}
