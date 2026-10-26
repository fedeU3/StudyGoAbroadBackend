import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator';
import { MONTO_REGEX } from '../../common/validators/formats';

export class CreateProgramaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombrePrograma: string;

  @IsInt()
  idTipoPrograma: number;

  @IsInt()
  idPaisDestino: number;

  @IsInt()
  idPaisExcursion: number;

  @IsInt()
  @Min(1)
  duracionPrograma: number;

  // String decimal positivo, por ejemplo "1500.00"
  @Matches(MONTO_REGEX, { message: 'montoTotalViaje debe ser un decimal positivo, por ejemplo "1500.00"' })
  montoTotalViaje: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  institucionReceptora: string;
}
