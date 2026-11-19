import { ArrayUnique, IsArray, IsInt, IsOptional, Matches, ValidateIf } from 'class-validator';
import { FECHA_REGEX } from '../../common/validators/formats';

export class CreateViajeDto {
  @IsInt()
  idPrograma: number;

  // Fecha tentativa (YYYY-MM-DD). Es obligatoria salvo que venga el vuelo
  // internacional de ida: en ese caso la fecha del viaje es la de ese vuelo.
  @ValidateIf((dto: CreateViajeDto) => dto.fechaSalida !== undefined || dto.idVueloInternacionalIda == null)
  @Matches(FECHA_REGEX, { message: 'fechaSalida debe tener formato YYYY-MM-DD' })
  fechaSalida?: string;

  // Vuelos del grupo, todos opcionales. Los internacionales tienen que ser
  // de tipo I y los nacionales de tipo N.
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  idVueloInternacionalIda?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  idVueloInternacionalVuelta?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  idVueloNacionalIda?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  idVueloNacionalVuelta?: number | null;

  // Pasajeros que viajan en el grupo; se pueden agregar mas despues
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  idsPasajeros?: number[];
}
