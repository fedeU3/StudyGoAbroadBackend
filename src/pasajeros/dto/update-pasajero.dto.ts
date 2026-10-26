import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreatePasajeroDto } from './create-pasajero.dto';
import { ESTADOS } from '../../common/validators/formats';

export class UpdatePasajeroDto extends PartialType(CreatePasajeroDto) {
  // A = Activo, B = Baja
  @IsOptional()
  @IsIn(ESTADOS)
  estado?: string;
}
