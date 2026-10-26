import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasaportesEntity } from './pasaportes.entity';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { CreatePasaporteDto } from './dto/create-pasaporte.dto';
import { UpdatePasaporteDto } from './dto/update-pasaporte.dto';
import { hoy } from '../common/validators/formats';

@Injectable()
export class PasaportesService {
  constructor(
    @InjectRepository(PasaportesEntity)
    private readonly pasaportesRepository: Repository<PasaportesEntity>,
    @InjectRepository(PasajerosEntity)
    private readonly pasajerosRepository: Repository<PasajerosEntity>,
    private readonly dataSource: DataSource,
  ) { }

  async getByPasajero(idPasajero: number) {
    const pasajero = await this.getPasajero(idPasajero);
    if (!pasajero.idPasaporte) {
      throw new NotFoundException(`El pasajero ${idPasajero} no tiene pasaporte`);
    }

    return this.pasaportesRepository.findOne({
      where: { idPasaporte: pasajero.idPasaporte },
      relations: { paisEmisor: true },
    });
  }

  // Crea el pasaporte y lo asigna al pasajero en una transaccion.
  // Si ya tenia uno (renovacion), el anterior pasa a baja y queda como historial.
  async createForPasajero(idPasajero: number, dto: CreatePasaporteDto) {
    const pasajero = await this.getPasajero(idPasajero);
    this.validarFechas(dto.fechaEmision, dto.fechaVencimiento);

    return this.dataSource.transaction(async (manager) => {
      const pasaporte = await manager.save(
        manager.create(PasaportesEntity, { ...dto, estado: 'A' }),
      );

      if (pasajero.idPasaporte) {
        await manager.update(PasaportesEntity, { idPasaporte: pasajero.idPasaporte }, { estado: 'B' });
      }
      await manager.update(PasajerosEntity, { idPasajero }, { idPasaporte: pasaporte.idPasaporte });

      return pasaporte;
    });
  }

  async updateForPasajero(idPasajero: number, dto: UpdatePasaporteDto) {
    const pasaporte = await this.getByPasajero(idPasajero);
    const actualizado = this.pasaportesRepository.merge(pasaporte!, dto);
    this.validarFechas(actualizado.fechaEmision, actualizado.fechaVencimiento);

    return this.pasaportesRepository.save(actualizado);
  }

  // Pasaportes activos que vencen dentro de `dias` o antes de un vuelo internacional futuro
  async getPorVencer(dias: number) {
    const limite = new Date();
    limite.setDate(limite.getDate() + dias);

    const pasajeros = await this.pasajerosRepository
      .createQueryBuilder('pasajero')
      .innerJoinAndSelect('pasajero.pasaporte', 'pasaporte')
      .leftJoin('pasajero.viajes', 'viaje')
      .leftJoin('viaje.vueloInternacional', 'vuelo')
      .where('pasaporte.estado = :activo', { activo: 'A' })
      .andWhere('pasajero.estado = :activo', { activo: 'A' })
      .andWhere(
        '(pasaporte.fechaVencimiento <= :limite OR (vuelo.fecha >= :ahora AND vuelo.fecha::date > pasaporte.fechaVencimiento))',
        { limite: limite.toISOString().slice(0, 10), ahora: new Date() },
      )
      .orderBy('pasaporte.fechaVencimiento', 'ASC')
      .getMany();

    return pasajeros.map(({ pasaporte, idPasajero, nombres, apellido, dni }) => ({
      ...pasaporte,
      vencido: pasaporte!.fechaVencimiento < hoy(),
      pasajero: { idPasajero, nombres, apellido, dni },
    }));
  }

  private async getPasajero(idPasajero: number) {
    const pasajero = await this.pasajerosRepository.findOneBy({ idPasajero });
    if (!pasajero) {
      throw new NotFoundException(`Pasajero con id ${idPasajero} no encontrado`);
    }

    return pasajero;
  }

  private validarFechas(emision: string, vencimiento: string) {
    if (vencimiento <= emision) {
      throw new BadRequestException('fechaVencimiento debe ser posterior a fechaEmision');
    }
  }
}
