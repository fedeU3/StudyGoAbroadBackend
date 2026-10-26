import { Body, Controller, Get, HttpCode, Patch, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { ChangePasswordDto } from '../usuarios/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // Endpoint de login que recibe un objeto LoginDTO y devuelve un token JWT si las credenciales son válidas
  // POST /auth/login
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<{ token: string }> {
    return this.authService.login(loginDTO);
  }

  // GET /auth/me
  @Get('me')
  @Auth()
  getMe(@Request() req) {
    return this.authService.getMe(req.user);
  }

  // PATCH /auth/password
  @Patch('password')
  @Auth()
  @Roles(Role.LECTOR, Role.EDITOR)
  @HttpCode(204)
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto): Promise<void> {
    await this.authService.changePassword(req.user.idUsuario, dto);
  }
}
