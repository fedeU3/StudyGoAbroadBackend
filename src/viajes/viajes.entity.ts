import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProgramasEntity } from '../programas/programas.entity';
import { VuelosEntity } from '../vuelos/vuelos.entity';
import { ViajesPasajerosEntity } from '../viajes-pasajeros/viajes-pasajeros.entity';
import { fechaDe } from '../common/validators/formats';

// Un viaje es un grupo de pasajeros que hace un programa en una fecha.
// Los vuelos son del grupo: todos sus pasajeros vuelan juntos.
@Entity({ name: 'Viajes' })
export class ViajesEntity {
  @PrimaryGeneratedColumn({ name: 'IdViaje', type: 'int' })
  idViaje: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdPrograma', type: 'int' })
  idPrograma: number;

  // Los 4 vuelos son opcionales: se cargan cuando se compran los pasajes
  @Column({ name: 'VueloInternacionalIda', type: 'int', nullable: true })
  idVueloInternacionalIda: number | null;

  @Column({ name: 'VueloInternacionalVuelta', type: 'int', nullable: true })
  idVueloInternacionalVuelta: number | null;

  @Column({ name: 'VueloNacionalIda', type: 'int', nullable: true })
  idVueloNacionalIda: number | null;

  @Column({ name: 'VueloNacionalVuelta', type: 'int', nullable: true })
  idVueloNacionalVuelta: number | null;

  // =========================
  // Campos
  // =========================

  // Tentativa hasta que se asigna el vuelo internacional de ida, que la reemplaza.
  // Se guarda a las 00:00 para que UI_FechaSalidaPrograma compare solo el dia.
  @Column('timestamp', {
    name: 'FechaSalida',
    transformer: {
      to: (value: string) => value,
      from: (value: Date | null) => (value ? fechaDe(value) : value),
    },
  })
  fechaSalida: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => ProgramasEntity)
  @JoinColumn({ name: 'IdPrograma' })
  programa: ProgramasEntity;

  @ManyToOne(() => VuelosEntity, { nullable: true })
  @JoinColumn({ name: 'VueloInternacionalIda' })
  vueloInternacionalIda: VuelosEntity | null;

  @ManyToOne(() => VuelosEntity, { nullable: true })
  @JoinColumn({ name: 'VueloInternacionalVuelta' })
  vueloInternacionalVuelta: VuelosEntity | null;

  @ManyToOne(() => VuelosEntity, { nullable: true })
  @JoinColumn({ name: 'VueloNacionalIda' })
  vueloNacionalIda: VuelosEntity | null;

  @ManyToOne(() => VuelosEntity, { nullable: true })
  @JoinColumn({ name: 'VueloNacionalVuelta' })
  vueloNacionalVuelta: VuelosEntity | null;

  @OneToMany(() => ViajesPasajerosEntity, (inscripcion) => inscripcion.viaje)
  inscripciones: ViajesPasajerosEntity[];
}
