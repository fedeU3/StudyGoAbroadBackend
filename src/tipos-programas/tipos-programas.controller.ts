import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TiposProgramasService } from './tipos-programas.service';

@Controller('tipos-programas')
export class TiposProgramasController {
  constructor(private readonly tiposProgramasService: TiposProgramasService) { }

  @Get()
  getAll() {
    return this.tiposProgramasService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.tiposProgramasService.getById(id);
  }
}
