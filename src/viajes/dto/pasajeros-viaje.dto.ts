import { ArrayMinSize, ArrayUnique, IsArray, IsInt } from 'class-validator';

// Pasajeros que se suman a un viaje existente; viajan en los vuelos del grupo
export class PasajerosViajeDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  idsPasajeros: number[];
}
