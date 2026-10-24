import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TiposProgramas' })
export class TiposProgramasEntity {
  // PK sin autoincremento: el id se asigna manualmente
  @PrimaryColumn({ name: 'IdTipoPrograma', type: 'int' })
  idTipoPrograma: number;

  @Column('varchar', { name: 'TipoPrograma', length: 20 })
  tipoPrograma: string;
}
