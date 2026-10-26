import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateInstitucionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  institucion: string;

  @IsInt()
  idPais: number;

  @IsInt()
  idProvincia: number;

  @IsInt()
  idCiudad: number;
}
