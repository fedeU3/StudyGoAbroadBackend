import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreatePasaporteDto } from './create-pasaporte.dto';
import { ESTADOS } from '../../common/validators/formats';

export class UpdatePasaporteDto extends PartialType(CreatePasaporteDto) {
  // A = Activo, B = Baja
  @IsOptional()
  @IsIn(ESTADOS)
  estado?: string;
}
