import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller()
@Auth()
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Get('pasajeros/:id/pagos')
  getByPasajero(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.getByPasajero(id);
  }

  @Post('pasajeros/:id/pagos')
  create(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePagoDto) {
    return this.pagosService.create(id, dto);
  }

  @Patch('pagos/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePagoDto) {
    return this.pagosService.update(id, dto);
  }
}
