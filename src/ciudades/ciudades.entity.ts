import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Ciudades' })
export class CiudadesEntity {
  @PrimaryGeneratedColumn({ name: 'IdCiudad', type: 'int' })
  idCiudad: number;

  @Column('varchar', { name: 'Ciudad', length: 100 })
  ciudad: string;
}
