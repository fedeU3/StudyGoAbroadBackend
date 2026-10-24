import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PaisesEntity } from '../paises/paises.entity';

@Entity({ name: 'Pasaportes' })
export class PasaportesEntity {
  @PrimaryGeneratedColumn({ name: 'IdPasaporte', type: 'int' })
  idPasaporte: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'PaisEmisor', type: 'int' })
  idPaisEmisor: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'NumeroPasaporte', length: 9 })
  numeroPasaporte: string;

  @Column('date', { name: 'FechaVencimiento' })
  fechaVencimiento: Date;

  @Column('date', { name: 'FechaEmision' })
  fechaEmision: Date;

  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'PaisEmisor' })
  paisEmisor: PaisesEntity;
}
