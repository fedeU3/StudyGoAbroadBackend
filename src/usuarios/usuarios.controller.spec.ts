import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuariosEntity } from './usuarios.entity';
import { RolesEntity } from '../roles/roles.entity';

// @nestjs/passport se publica como ESM y Jest no lo puede importar
jest.mock('../auth/decorators/auth.decorator', () => ({ Auth: () => () => undefined }));

describe('UsuariosController', () => {
  let usuariosController: UsuariosController;
  const usuariosRepository = { find: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(UsuariosEntity), useValue: usuariosRepository },
        { provide: getRepositoryToken(RolesEntity), useValue: {} },
      ],
    }).compile();

    usuariosController = app.get<UsuariosController>(UsuariosController);
  });

  describe('getAll', () => {
    it('should return all usuarios without password or token', async () => {
      usuariosRepository.find.mockResolvedValue([
        { idUsuario: 1, usuario: 'coni', password: 'hash', token: 'jwt', rol: { idRol: 2, rol: 'EDITOR' } },
      ]);

      await expect(usuariosController.getAll()).resolves.toEqual([
        { idUsuario: 1, usuario: 'coni', rol: 'EDITOR' },
      ]);
      expect(usuariosRepository.find).toHaveBeenCalled();
    });
  });
});
