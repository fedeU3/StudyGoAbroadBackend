import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

// Por defecto los listados solo devuelven registros con Estado = 'A'
export class EstadoQueryDto {
  @IsOptional()
  @Transform(({ obj }) => obj.incluirBajas === 'true' || obj.incluirBajas === true)
  @IsBoolean()
  incluirBajas?: boolean;
}
