import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { InstitucionesService } from './instituciones.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { InstitucionesQueryDto } from './dto/instituciones-query.dto';
import { EstadoQueryDto } from '../common/dto/estado-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('instituciones')
@Auth()
export class InstitucionesController {
  constructor(private readonly institucionesService: InstitucionesService) { }

  @Get()
  getAll(@Query() query: InstitucionesQueryDto) {
    return this.institucionesService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.institucionesService.getById(id);
  }

  @Get(':id/pasajeros')
  getPasajeros(@Param('id', ParseIntPipe) id: number, @Query() query: EstadoQueryDto) {
    return this.institucionesService.getPasajeros(id, query.incluirBajas);
  }

  @Post()
  create(@Body() dto: CreateInstitucionDto) {
    return this.institucionesService.create(dto);
  }

  // Tambien da de baja: { "estado": "B" }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInstitucionDto) {
    return this.institucionesService.update(id, dto);
  }
}
