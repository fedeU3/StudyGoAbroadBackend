import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosEntity } from './usuarios.entity';
import { RolesEntity } from '../roles/roles.entity';
import { Role } from '../auth/enums/role.enum';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(UsuariosEntity)
    private readonly UsuariosRepository: Repository<UsuariosEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) { }

  // Nunca se devuelven Password ni Token
  toResponse(usuario: UsuariosEntity) {
    return {
      idUsuario: usuario.idUsuario,
      usuario: usuario.usuario,
      rol: usuario.rol?.rol,
    };
  }

  async getAll() {
    const usuarios = await this.UsuariosRepository.find({ order: { usuario: 'ASC' } });
    return usuarios.map((usuario) => this.toResponse(usuario));
  }

  getById(id: number) {
    return this.UsuariosRepository.findOne({
      where: { idUsuario: id }
    });
  }

  getByUserName(usuario: string) {
    return this.UsuariosRepository.findOne({
      where: { usuario }
    });
  }

  async updateToken(id: number, token: string): Promise<void> {
    await this.UsuariosRepository.update({ idUsuario: id }, { token });
  }

  async updateUsuario(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.getById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    if (dto.idRol !== undefined && dto.idRol !== usuario.idRol) {
      const rol = await this.rolesRepository.findOneBy({ idRol: dto.idRol });
      if (!rol) {
        throw new NotFoundException(`Rol con id ${dto.idRol} no encontrado`);
      }

      // El ultimo editor no puede perder su rol: nadie podria volver a gestionar usuarios
      const esEditor = usuario.rol?.rol?.toUpperCase() === Role.EDITOR;
      if (esEditor && rol.rol.toUpperCase() !== Role.EDITOR) {
        const editores = await this.UsuariosRepository.count({
          where: { idRol: usuario.idRol },
        });
        if (editores <= 1) {
          throw new BadRequestException('No se puede quitar el rol al último editor');
        }
      }

      usuario.idRol = rol.idRol;
      usuario.rol = rol;
    }

    if (dto.password !== undefined) {
      usuario.password = await bcrypt.hash(dto.password, 10);
    }

    await this.UsuariosRepository.save(usuario);
    return this.toResponse(usuario);
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<void> {
    const usuario = await this.UsuariosRepository.findOne({ where: { idUsuario: id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const passwordMatch = await bcrypt.compare(dto.passwordActual, usuario.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(dto.passwordNueva, 10);
    await this.UsuariosRepository.update({ idUsuario: id }, { password: hashedPassword });
  }
}
