import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateInstitucionDto } from './create-institucion.dto';
import { ESTADOS } from '../../common/validators/formats';

export class UpdateInstitucionDto extends PartialType(CreateInstitucionDto) {
  // A = Activo, B = Baja
  @IsOptional()
  @IsIn(ESTADOS)
  estado?: string;
}
