import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TiposProgramasEntity } from '../tipos-programas/tipos-programas.entity';
import { PaisesEntity } from '../paises/paises.entity';

@Entity({ name: 'Programa' })
export class ProgramasEntity {
  @PrimaryGeneratedColumn({ name: 'IdPrograma', type: 'int' })
  idPrograma: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdTipoPrograma', type: 'int' })
  idTipoPrograma: number;

  @Column({ name: 'PaisExcursion', type: 'int' })
  idPaisExcursion: number;

  @Column({ name: 'PaisDestino', type: 'int' })
  idPaisDestino: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'NombrePrograma', length: 50 })
  nombrePrograma: string;

  @Column('int', { name: 'DuracionPrograma' })
  duracionPrograma: number;

  @Column('decimal', { name: 'MontoTotalViaje', precision: 15, scale: 2 })
  montoTotalViaje: number;

  @Column('varchar', { name: 'InstitucionReceptora', length: 100 })
  institucionReceptora: string;

  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => TiposProgramasEntity)
  @JoinColumn({ name: 'IdTipoPrograma' })
  tipoPrograma: TiposProgramasEntity;

  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'PaisExcursion' })
  paisExcursion: PaisesEntity;

  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'PaisDestino' })
  paisDestino: PaisesEntity;
}
