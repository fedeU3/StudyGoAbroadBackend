import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { PasajerosEntity } from '../pasajeros/pasajeros.entity';

// PK compuesta: ("IdPago", "IdPasajero")
@Entity({ name: 'Pagos' })
export class PagosEntity {
  @PrimaryGeneratedColumn({ name: 'IdPago', type: 'int' })
  idPago: number;

  // =========================
  // FKs (ids)
  // =========================

  @PrimaryColumn({ name: 'IdPasajero', type: 'int' })
  idPasajero: number;

  // =========================
  // Campos
  // =========================

  @Column('int', { name: 'NumeroCuota' })
  numeroCuota: number;

  @Column('decimal', { name: 'MontoAbonado', precision: 15, scale: 2 })
  montoAbonado: number;

  @Column('timestamp', { name: 'FechaPago' })
  fechaPago: Date;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => PasajerosEntity)
  @JoinColumn({ name: 'IdPasajero' })
  pasajero: PasajerosEntity;
}
