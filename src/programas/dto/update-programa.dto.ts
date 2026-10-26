import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateProgramaDto } from './create-programa.dto';
import { ESTADOS } from '../../common/validators/formats';

export class UpdateProgramaDto extends PartialType(CreateProgramaDto) {
  // A = Activo, B = Baja
  @IsOptional()
  @IsIn(ESTADOS)
  estado?: string;
}
