import { Controller, Get } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { Auth } from '../auth/decorators/auth.decorator';

// Solo lectura: los datos se cargan por seed
@Controller('ciudades')
@Auth()
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) { }

  @Get()
  getAll() {
    return this.ciudadesService.getAll();
  }
}
