import { IsInt, IsISO8601, Matches, Min } from 'class-validator';
import { MONTO_REGEX } from '../../common/validators/formats';

export class CreatePagoDto {
  @IsInt()
  @Min(1)
  numeroCuota: number;

  // String decimal positivo, por ejemplo "1500.00"
  @Matches(MONTO_REGEX, { message: 'montoAbonado debe ser un decimal positivo, por ejemplo "1500.00"' })
  montoAbonado: string;

  // ISO 8601, no futura (se valida en el service)
  @IsISO8601()
  fechaPago: string;
}
