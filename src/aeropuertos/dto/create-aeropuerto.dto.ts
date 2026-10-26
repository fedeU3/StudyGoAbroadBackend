import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAeropuertoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  aeropuerto: string;
}
