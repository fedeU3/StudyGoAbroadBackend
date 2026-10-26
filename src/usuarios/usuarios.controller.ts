import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

// Los usuarios se cargan por seed: no hay alta desde la API
@Controller("usuarios")
@Auth()
@Roles(Role.EDITOR)
export class UsuariosController {
  constructor(private readonly appService: UsuariosService) { }

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.appService.updateUsuario(id, updateUsuarioDto);
  }
}
