import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProgramasService } from './programas.service';

@Controller('programas')
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) { }

  @Get()
  getAll() {
    return this.programasService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.programasService.getById(id);
  }
}
