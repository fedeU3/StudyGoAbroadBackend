import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { UsuariosEntity } from '../usuarios/usuarios.entity';
import { ChangePasswordDto } from '../usuarios/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService
  ) { }

  getMe(user: UsuariosEntity) {
    return this.usuariosService.toResponse(user);
  }

  // Endpoint de login que recibe un objeto LoginDTO y devuelve un token JWT si las credenciales son válidas
  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const { usuario, password } = loginDTO;

    // Mismo mensaje si el usuario no existe o la contraseña es incorrecta,
    // para no revelar que usuarios existen
    const existingUser = await this.usuariosService.getByUserName(usuario);
    const passwordMatch =
      existingUser && (await bcrypt.compare(password, existingUser.password));
    if (!existingUser || !passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Genera un token JWT para el usuario autenticado
    const token = this.jwtService.sign({
      id: existingUser.idUsuario,
      rol: existingUser.rol?.rol,
    })

    // Actualiza el token en la base de datos
    await this.usuariosService.updateToken(existingUser.idUsuario, token);

    // Devuelve el token al cliente
    return { token };
  }

  changePassword(idUsuario: number, dto: ChangePasswordDto): Promise<void> {
    return this.usuariosService.changePassword(idUsuario, dto);
  }
}
