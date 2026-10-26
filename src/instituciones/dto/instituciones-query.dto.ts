import { IsOptional, IsString } from 'class-validator';
import { EstadoQueryDto } from '../../common/dto/estado-query.dto';

export class InstitucionesQueryDto extends EstadoQueryDto {
  // Busca por nombre
  @IsOptional()
  @IsString()
  search?: string;
}
