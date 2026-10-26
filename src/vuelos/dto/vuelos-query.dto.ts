import { IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class VuelosQueryDto extends PaginationQueryDto {
  // Los proximos vuelos se piden con ?desde=<hoy>
  @IsOptional()
  @IsISO8601()
  desde?: string;

  @IsOptional()
  @IsISO8601()
  hasta?: string;

  // Aeropuerto de origen o de destino
  @IsOptional()
  @IsInt()
  idAeropuerto?: number;

  @IsOptional()
  @IsString()
  numeroVuelo?: string;
}
