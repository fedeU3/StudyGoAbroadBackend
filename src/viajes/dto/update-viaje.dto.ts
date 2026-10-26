import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateViajeDto } from './create-viaje.dto';

// Solo se cambian los vuelos: para cambiar pasajero o programa se crea otro viaje
export class UpdateViajeDto extends PartialType(OmitType(CreateViajeDto, ['idPrograma'] as const)) { }
