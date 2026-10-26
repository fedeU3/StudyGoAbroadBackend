import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsInt()
  idRol?: number;

  // Reseteo de contraseña por un editor
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
