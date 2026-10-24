import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AeropuertosEntity } from '../aeropuertos/aeropuertos.entity';

@Entity({ name: 'Vuelos' })
export class VuelosEntity {
  @PrimaryGeneratedColumn({ name: 'IdVuelo', type: 'int' })
  idVuelo: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'AeropuertoOrigen', type: 'int' })
  idAeropuertoOrigen: number;

  @Column({ name: 'AeropuertoDestino', type: 'int' })
  idAeropuertoDestino: number;

  // =========================
  // Campos
  // =========================

  @Column('char', { name: 'NumeroVuelo', length: 9 })
  numeroVuelo: string;

  @Column('char', { name: 'TipoVuelo', length: 1 })
  tipoVuelo: string;

  @Column('timestamp', { name: 'Fecha' })
  fecha: Date;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => AeropuertosEntity)
  @JoinColumn({ name: 'AeropuertoOrigen' })
  aeropuertoOrigen: AeropuertosEntity;

  @ManyToOne(() => AeropuertosEntity)
  @JoinColumn({ name: 'AeropuertoDestino' })
  aeropuertoDestino: AeropuertosEntity;
}
