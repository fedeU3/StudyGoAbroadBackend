import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  passwordActual: string;

  @IsString()
  @MinLength(8)
  passwordNueva: string;
}
