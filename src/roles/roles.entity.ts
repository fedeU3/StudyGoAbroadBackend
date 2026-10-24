import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Roles' })
export class RolesEntity {
  @PrimaryGeneratedColumn({ name: 'IdRol', type: 'int' })
  idRol: number;

  @Column('varchar', { name: 'Rol', length: 20 })
  rol: string;
}
