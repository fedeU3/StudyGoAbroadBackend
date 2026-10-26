import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RolesEntity } from '../roles/roles.entity';

@Entity({ name: 'Usuarios' })
export class UsuariosEntity {
  @PrimaryGeneratedColumn({ name: 'IdUsuario', type: 'int' })
  idUsuario: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdRol', type: 'int' })
  idRol: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'Usuario', length: 20 })
  usuario: string;

  @Column('varchar', { name: 'Token', length: 512 })
  token: string;

  @Column('char', { name: 'Password', length: 60 })
  password: string;

  // =========================
  // Relaciones
  // =========================

  // eager: el rol se necesita en cada request para autorizar
  @ManyToOne(() => RolesEntity, { eager: true })
  @JoinColumn({ name: 'IdRol' })
  rol: RolesEntity;
}
