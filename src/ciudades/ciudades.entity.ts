import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { ProvinciasEntity } from '../provincias/provincias.entity';

// PK compuesta: ("IdCiudad", "IdProvincia")
@Entity({ name: 'Ciudades' })
export class CiudadesEntity {
  @PrimaryGeneratedColumn({ name: 'IdCiudad', type: 'int' })
  idCiudad: number;

  // =========================
  // FKs (ids)
  // =========================

  @PrimaryColumn({ name: 'IdProvincia', type: 'int' })
  idProvincia: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'Ciudad', length: 100 })
  ciudad: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => ProvinciasEntity)
  @JoinColumn({ name: 'IdProvincia' })
  provincia: ProvinciasEntity;
}
