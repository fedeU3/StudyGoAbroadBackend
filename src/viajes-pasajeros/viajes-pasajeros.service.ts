import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsRelations, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ViajesPasajerosEntity } from './viajes-pasajeros.entity';
import { ViajesEntity } from '../viajes/viajes.entity';

// Acceso a la tabla intermedia viaje <-> pasajero. Las validaciones del viaje
// y de los pasajeros (que existan) las hace ViajesService antes de llamar aca.
@Injectable()
export class ViajesPasajerosService {
  constructor(
    @InjectRepository(ViajesPasajerosEntity)
    private readonly viajesPasajerosRepository: Repository<ViajesPasajerosEntity>,
  ) { }

  // Viajes de un pasajero, con las relaciones que pida el llamador
  async getViajesDePasajero(idPasajero: number, relaciones: FindOptionsRelations<ViajesEntity>) {
    const filas = await this.viajesPasajerosRepository.find({
      where: { idPasajero },
      relations: { viaje: relaciones },
    });

    return filas.map((fila) => fila.viaje);
  }

  // Cantidad de pasajeros por viaje, en una sola consulta
  async contarPorViaje(idsViajes: number[]): Promise<Map<number, number>> {
    if (!idsViajes.length) return new Map();

    const filas: { idViaje: number; cantidad: number }[] = await this.viajesPasajerosRepository
      .createQueryBuilder('viajePasajero')
      .select('viajePasajero.idViaje', 'idViaje')
      .addSelect('COUNT(*)::int', 'cantidad')
      .where('viajePasajero.idViaje IN (:...ids)', { ids: idsViajes })
      .groupBy('viajePasajero.idViaje')
      .getRawMany();

    return new Map(filas.map((fila) => [fila.idViaje, fila.cantidad]));
  }

  // Suma pasajeros al viaje. Con manager corre dentro de la transaccion del llamador.
  async agregar(idViaje: number, idsPasajeros: number[], manager?: EntityManager) {
    const repo = manager ? manager.getRepository(ViajesPasajerosEntity) : this.viajesPasajerosRepository;

    const yaEstan = await repo.find({
      where: { idViaje, idPasajero: In(idsPasajeros) },
      relations: { pasajero: true },
    });
    if (yaEstan.length) {
      const nombres = yaEstan.map(({ pasajero }) => `${pasajero.nombres} ${pasajero.apellido}`).join(', ');
      throw new ConflictException(`Ya están en el viaje: ${nombres}`);
    }

    // Un solo INSERT con todas las filas: es atomico
    await repo.insert(idsPasajeros.map((idPasajero) => ({ idPasajero, idViaje })));
  }

  // Borra la fila: la tabla no tiene Estado
  async quitar(idViaje: number, idPasajero: number) {
    const { affected } = await this.viajesPasajerosRepository.delete({ idViaje, idPasajero });
    if (!affected) {
      throw new NotFoundException(`El pasajero con id ${idPasajero} no está en el viaje ${idViaje}`);
    }
  }
}
