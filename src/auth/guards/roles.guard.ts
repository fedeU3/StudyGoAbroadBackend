import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Sin @Roles(): los GET son para lector y editor, el resto solo para editor
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ??
      (request.method === 'GET' ? [Role.LECTOR, Role.EDITOR] : [Role.EDITOR]);

    const rol = request.user?.rol?.rol?.toUpperCase();

    return requiredRoles.includes(rol);
  }
}
