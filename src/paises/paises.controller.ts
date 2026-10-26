import { Controller, Get } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { Auth } from '../auth/decorators/auth.decorator';

// Solo lectura: los datos se cargan por seed
@Controller('paises')
@Auth()
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) { }

  @Get()
  getAll() {
    return this.paisesService.getAll();
  }
}
