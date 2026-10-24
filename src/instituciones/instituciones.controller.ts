import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InstitucionesService } from './instituciones.service';

@Controller('instituciones')
export class InstitucionesController {
  constructor(private readonly institucionesService: InstitucionesService) { }

  @Get()
  getAll() {
    return this.institucionesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.institucionesService.getById(id);
  }
}
