import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { ProgramasEntity } from '../programas/programas.entity';
import { VuelosEntity } from '../vuelos/vuelos.entity';

// PK compuesta: ("IdViaje", "IdPasajero", "IdPrograma")
@Entity({ name: 'Viajes' })
export class ViajesEntity {
  @PrimaryGeneratedColumn({ name: 'IdViaje', type: 'int' })
  idViaje: number;

  // =========================
  // FKs (ids)
  // =========================

  @PrimaryColumn({ name: 'IdPasajero', type: 'int' })
  idPasajero: number;

  @PrimaryColumn({ name: 'IdPrograma', type: 'int' })
  idPrograma: number;

  @Column({ name: 'VueloInternacional', type: 'int' })
  idVueloInternacional: number;

  @Column({ name: 'VueloNacional', type: 'int', nullable: true })
  idVueloNacional: number | null;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => PasajerosEntity, (pasajero) => pasajero.viajes)
  @JoinColumn({ name: 'IdPasajero' })
  pasajero: PasajerosEntity;

  @ManyToOne(() => ProgramasEntity)
  @JoinColumn({ name: 'IdPrograma' })
  programa: ProgramasEntity;

  @ManyToOne(() => VuelosEntity)
  @JoinColumn({ name: 'VueloInternacional' })
  vueloInternacional: VuelosEntity;

  @ManyToOne(() => VuelosEntity, { nullable: true })
  @JoinColumn({ name: 'VueloNacional' })
  vueloNacional: VuelosEntity | null;
}
