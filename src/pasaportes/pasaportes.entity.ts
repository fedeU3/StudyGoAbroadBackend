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

  // DATE como string YYYY-MM-DD
  @Column('date', { name: 'FechaVencimiento' })
  fechaVencimiento: string;

  @Column('date', { name: 'FechaEmision' })
  fechaEmision: string;

  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'PaisEmisor' })
  paisEmisor: PaisesEntity;
}
