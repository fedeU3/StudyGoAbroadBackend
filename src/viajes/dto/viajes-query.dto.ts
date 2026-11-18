import { IsInt, IsOptional, Matches } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { FECHA_REGEX } from '../../common/validators/formats';

export class ViajesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt()
  idPrograma?: number;

  // Rango sobre la fecha de salida (YYYY-MM-DD). Los proximos viajes se piden con ?desde=<hoy>
  @IsOptional()
  @Matches(FECHA_REGEX, { message: 'desde debe tener formato YYYY-MM-DD' })
  desde?: string;

  @IsOptional()
  @Matches(FECHA_REGEX, { message: 'hasta debe tener formato YYYY-MM-DD' })
  hasta?: string;
}
