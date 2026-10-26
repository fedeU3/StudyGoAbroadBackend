import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { ProgramasQueryDto } from './dto/programas-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';

// GET /programas/:id/viajes esta en el modulo de viajes
@Controller('programas')
@Auth()
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) { }

  @Get()
  getAll(@Query() query: ProgramasQueryDto) {
    return this.programasService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.programasService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateProgramaDto) {
    return this.programasService.create(dto);
  }

  // Tambien da de baja: { "estado": "B" }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProgramaDto) {
    return this.programasService.update(id, dto);
  }
}
