import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class CreateViajeDto {
  @IsInt()
  idPrograma: number;

  // Vuelo de tipo I
  @IsInt()
  idVueloInternacional: number;

  // Vuelo de tipo N, opcional
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  idVueloNacional?: number | null;
}
