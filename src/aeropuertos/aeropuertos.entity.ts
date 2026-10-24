import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// El nombre de la tabla en DB es "Aeropuetos" (sic)
@Entity({ name: 'Aeropuetos' })
export class AeropuertosEntity {
  @PrimaryGeneratedColumn({ name: 'IdAeropuerto', type: 'int' })
  idAeropuerto: number;

  @Column('varchar', { name: 'Aeropuerto', length: 120 })
  aeropuerto: string;
}
