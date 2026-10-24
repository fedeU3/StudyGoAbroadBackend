import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PasaportesEntity } from '../pasaportes/pasaportes.entity';
import { ProvinciasEntity } from '../provincias/provincias.entity';
import { CiudadesEntity } from '../ciudades/ciudades.entity';
import { InstitucionesEntity } from '../instituciones/instituciones.entity';

@Entity({ name: 'Pasajeros' })
export class PasajerosEntity {
  @PrimaryGeneratedColumn({ name: 'IdPasajero', type: 'int' })
  idPasajero: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdPasaporte', type: 'int', nullable: true })
  idPasaporte: number | null;

  @Column({ name: 'IdProvincia', type: 'int' })
  idProvincia: number;

  @Column({ name: 'IdCiudad', type: 'int' })
  idCiudad: number;

  @Column({ name: 'IdInstitucion', type: 'int' })
  idInstitucion: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'IdFactura', length: 100 })
  idFactura: string;

  @Column('varchar', { name: 'Nombres', length: 30 })
  nombres: string;

  @Column('varchar', { name: 'Apellido', length: 30 })
  apellido: string;

  @Column('varchar', { name: 'DNI', length: 8 })
  dni: string;

  @Column('date', { name: 'FechaNacimiento' })
  fechaNacimiento: Date;

  @Column('varchar', { name: 'Nacionalidad', length: 30 })
  nacionalidad: string;

  @Column('varchar', { name: 'Domicilio', length: 120 })
  domicilio: string;

  @Column('varchar', { name: 'Email', length: 120 })
  email: string;

  @Column('varchar', { name: 'Alergia', length: 120, nullable: true })
  alergia: string | null;

  @Column('varchar', { name: 'Dieta', length: 120, nullable: true })
  dieta: string | null;

  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => PasaportesEntity, { nullable: true })
  @JoinColumn({ name: 'IdPasaporte' })
  pasaporte: PasaportesEntity | null;

  @ManyToOne(() => ProvinciasEntity)
  @JoinColumn({ name: 'IdProvincia' })
  provincia: ProvinciasEntity;

  @ManyToOne(() => CiudadesEntity)
  @JoinColumn({ name: 'IdCiudad' })
  ciudad: CiudadesEntity;

  @ManyToOne(() => InstitucionesEntity)
  @JoinColumn({ name: 'IdInstitucion' })
  institucion: InstitucionesEntity;
}
