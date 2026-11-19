import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateViajeDto } from './create-viaje.dto';

// Se cambian la fecha tentativa y los vuelos, que afectan a todo el grupo.
// El programa no cambia (se crea otro viaje) y los pasajeros tienen sus propias rutas.
export class UpdateViajeDto extends PartialType(OmitType(CreateViajeDto, ['idPrograma', 'idsPasajeros'] as const)) { }
