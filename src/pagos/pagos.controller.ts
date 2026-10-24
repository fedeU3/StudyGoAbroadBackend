import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Get()
  getAll() {
    return this.pagosService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.getById(id);
  }
}
