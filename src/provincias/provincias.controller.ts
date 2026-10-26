import { Controller, Get } from '@nestjs/common';
import { ProvinciasService } from './provincias.service';
import { Auth } from '../auth/decorators/auth.decorator';

// Solo lectura: los datos se cargan por seed
@Controller('provincias')
@Auth()
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) { }

  @Get()
  getAll() {
    return this.provinciasService.getAll();
  }
}
