import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { ViajesEntity } from '../viajes/viajes.entity';

// Pasajeros de cada viaje. PK compuesta: un pasajero no se repite en el mismo viaje.
// No tiene Estado: quitar a un pasajero del viaje borra la fila.
@Entity({ name: 'ViajesPasajeros' })
export class ViajesPasajerosEntity {
  @PrimaryColumn({ name: 'IdPasajero', type: 'int' })
  idPasajero: number;

  @PrimaryColumn({ name: 'IdViaje', type: 'int' })
  idViaje: number;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => ViajesEntity, (viaje) => viaje.inscripciones)
  @JoinColumn({ name: 'IdViaje' })
  viaje: ViajesEntity;

  @ManyToOne(() => PasajerosEntity, (pasajero) => pasajero.inscripciones)
  @JoinColumn({ name: 'IdPasajero' })
  pasajero: PasajerosEntity;
}
