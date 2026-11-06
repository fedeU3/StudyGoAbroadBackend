import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MediosDePago' })
export class MediosDePagoEntity {
  @PrimaryGeneratedColumn({ name: 'IdMedioDePago', type: 'int' })
  idMedioDePago: number;

  @Column('varchar', { name: 'MedioDePago', length: 30 })
  medioDePago: string;

  @Column('char', { name: 'Estado', length: 1, nullable: true })
  estado: string | null;
}
