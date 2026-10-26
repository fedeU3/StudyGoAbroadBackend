import { IsInt, IsOptional, Min } from 'class-validator';

export class PorVencerQueryDto {
  // Umbral en dias desde hoy
  @IsOptional()
  @IsInt()
  @Min(0)
  dias: number = 180;
}
