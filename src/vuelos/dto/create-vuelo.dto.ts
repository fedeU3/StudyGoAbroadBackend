import { IsIn, IsInt, IsISO8601, Matches } from 'class-validator';

export class CreateVueloDto {
  // Codigo de aerolinea + numero, por ejemplo "AR1132"
  @Matches(/^[A-Z0-9]{3,9}$/, { message: 'numeroVuelo debe tener entre 3 y 9 letras mayúsculas o dígitos' })
  numeroVuelo: string;

  // I = Internacional, N = Nacional
  @IsIn(['I', 'N'])
  tipoVuelo: string;

  // ISO 8601, por ejemplo "2026-03-15T14:30:00"
  @IsISO8601()
  fecha: string;

  @IsInt()
  idAeropuertoOrigen: number;

  @IsInt()
  idAeropuertoDestino: number;
}
