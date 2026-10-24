import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ViajesService } from './viajes.service';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) { }

  @Get()
  getAll() {
    return this.viajesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getById(id);
  }
}
