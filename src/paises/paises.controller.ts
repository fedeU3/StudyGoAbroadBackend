import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaisesService } from './paises.service';

@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) { }

  @Get()
  getAll() {
    return this.paisesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.paisesService.getById(id);
  }
}
