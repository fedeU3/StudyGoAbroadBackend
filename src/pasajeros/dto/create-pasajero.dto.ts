import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { FECHA_REGEX } from '../../common/validators/formats';

export class CreatePasajeroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  idFactura: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  apellido: string;

  @Matches(/^\d{8}$/, { message: 'dni debe tener 8 dígitos' })
  dni: string;

  // YYYY-MM-DD, no futura (se valida en el service)
  @Matches(FECHA_REGEX, { message: 'fechaNacimiento debe tener formato YYYY-MM-DD' })
  fechaNacimiento: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nacionalidad: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  domicilio: string;

  @IsEmail()
  @MaxLength(120)
  email: string;

  @IsInt()
  idProvincia: number;

  @IsInt()
  idCiudad: number;

  @IsInt()
  idInstitucion: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  alergia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  dieta?: string;
}
