import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Paises' })
export class PaisesEntity {
  @PrimaryGeneratedColumn({ name: 'IdPais', type: 'int' })
  idPais: number;

  @Column('varchar', { name: 'Pais', length: 50 })
  pais: string;
}
