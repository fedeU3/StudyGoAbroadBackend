import { Controller, Get } from '@nestjs/common';
import { TiposProgramasService } from './tipos-programas.service';
import { Auth } from '../auth/decorators/auth.decorator';

// Solo lectura: los datos se cargan por seed
@Controller('tipos-programas')
@Auth()
export class TiposProgramasController {
  constructor(private readonly tiposProgramasService: TiposProgramasService) { }

  @Get()
  getAll() {
    return this.tiposProgramasService.getAll();
  }
}
