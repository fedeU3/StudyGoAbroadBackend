import { IsInt, Matches } from 'class-validator';
import { FECHA_REGEX } from '../../common/validators/formats';

export class CreatePasaporteDto {
  @Matches(/^[A-Z0-9]{6,9}$/, { message: 'numeroPasaporte debe tener entre 6 y 9 letras mayúsculas o dígitos' })
  numeroPasaporte: string;

  @IsInt()
  idPaisEmisor: number;

  @Matches(FECHA_REGEX, { message: 'fechaEmision debe tener formato YYYY-MM-DD' })
  fechaEmision: string;

  // Posterior a la emision (se valida en el service)
  @Matches(FECHA_REGEX, { message: 'fechaVencimiento debe tener formato YYYY-MM-DD' })
  fechaVencimiento: string;
}
