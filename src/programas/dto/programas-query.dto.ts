import { IsInt, IsOptional } from 'class-validator';
import { EstadoQueryDto } from '../../common/dto/estado-query.dto';

export class ProgramasQueryDto extends EstadoQueryDto {
  @IsOptional()
  @IsInt()
  idTipoPrograma?: number;

  @IsOptional()
  @IsInt()
  idPaisDestino?: number;
}
