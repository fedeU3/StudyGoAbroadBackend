import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CiudadesEntity } from '../ciudades/ciudades.entity';
import { ProvinciasEntity } from '../provincias/provincias.entity';
import { PaisesEntity } from '../paises/paises.entity';

@Entity({ name: 'Institucion' })
export class InstitucionesEntity {
  @PrimaryGeneratedColumn({ name: 'IdInstitucion', type: 'int' })
  idInstitucion: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdCiudad', type: 'int' })
  idCiudad: number;

  @Column({ name: 'IdProvincia', type: 'int' })
  idProvincia: number;

  @Column({ name: 'IdPais', type: 'int' })
  idPais: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'Institucion', length: 100 })
  institucion: string;

  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => CiudadesEntity)
  @JoinColumn({ name: 'IdCiudad' })
  ciudad: CiudadesEntity;

  @ManyToOne(() => ProvinciasEntity)
  @JoinColumn({ name: 'IdProvincia' })
  provincia: ProvinciasEntity;

  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'IdPais' })
  pais: PaisesEntity;
}
