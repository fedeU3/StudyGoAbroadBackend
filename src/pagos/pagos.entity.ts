import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { MediosDePagoEntity } from '../medios-de-pago/medios-de-pago.entity';

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

  @Column({ name: 'IdMedioDePago', type: 'int' })
  idMedioDePago: number;

  // =========================
  // Campos
  // =========================

  @Column('int', { name: 'NumeroCuota' })
  numeroCuota: number;

  // DECIMAL como string para no perder precision
  @Column('decimal', { name: 'MontoAbonado', precision: 15, scale: 2 })
  montoAbonado: string;

  @Column('timestamp', { name: 'FechaPago' })
  fechaPago: Date;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => PasajerosEntity, (pasajero) => pasajero.pagos)
  @JoinColumn({ name: 'IdPasajero' })
  pasajero: PasajerosEntity;

  @ManyToOne(() => MediosDePagoEntity)
  @JoinColumn({ name: 'IdMedioDePago' })
  medioDePago: MediosDePagoEntity;
}
