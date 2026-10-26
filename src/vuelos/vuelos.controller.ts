import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { VuelosService } from './vuelos.service';
import { CreateVueloDto } from './dto/create-vuelo.dto';
import { UpdateVueloDto } from './dto/update-vuelo.dto';
import { VuelosQueryDto } from './dto/vuelos-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('vuelos')
@Auth()
export class VuelosController {
  constructor(private readonly vuelosService: VuelosService) { }

  @Get()
  getAll(@Query() query: VuelosQueryDto) {
    return this.vuelosService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.vuelosService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateVueloDto) {
    return this.vuelosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVueloDto) {
    return this.vuelosService.update(id, dto);
  }
}
