import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Auth } from '../auth/decorators/auth.decorator';

// Solo lectura: los datos se cargan por seed
@Controller('roles')
@Auth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  getAll() {
    return this.rolesService.getAll();
  }
}
