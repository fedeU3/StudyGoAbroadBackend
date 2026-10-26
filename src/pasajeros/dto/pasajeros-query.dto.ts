import { IntersectionType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { EstadoQueryDto } from '../../common/dto/estado-query.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class PasajerosQueryDto extends IntersectionType(PaginationQueryDto, EstadoQueryDto) {
  // Busca en apellido, nombres, DNI y email
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  idInstitucion?: number;

  @IsOptional()
  @IsInt()
  idProvincia?: number;
}
