import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";

// Exige JWT y aplica los permisos por rol (ver RolesGuard)
export const Auth = () =>
  applyDecorators(UseGuards(AuthGuard('jwt'), RolesGuard));
