import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Opción mínima: forzamos a TS a tratarlo como definido
      // (si JWT_SECRET no existe, fallará en runtime)
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // El rol se lee de la BD en cada request, asi un cambio de rol aplica de inmediato
  async validate(payload: any) {
    const { id } = payload;
    const user = await this.usuariosService.getById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;
  }
}
