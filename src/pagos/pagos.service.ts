import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PagosEntity } from './pagos.entity';
import { PasajerosEntity } from '../pasajeros/pasajeros.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(PagosEntity)
    private readonly pagosRepository: Repository<PagosEntity>,
    @InjectRepository(PasajerosEntity)
    private readonly pasajerosRepository: Repository<PasajerosEntity>,
  ) { }

  // Historial del pasajero con el total abonado y la siguiente cuota sugerida
  async getByPasajero(idPasajero: number) {
    await this.getPasajero(idPasajero);

    const items = await this.pagosRepository.find({
      where: { idPasajero },
      order: { numeroCuota: 'ASC' },
    });

    // La suma la hace PostgreSQL sobre DECIMAL: el resultado es exacto
    const { total } = await this.pagosRepository
      .createQueryBuilder('pago')
      .select('COALESCE(SUM(pago.montoAbonado), 0)::text', 'total')
      .where('pago.idPasajero = :idPasajero', { idPasajero })
      .getRawOne();

    const ultimaCuota = items.length ? items[items.length - 1].numeroCuota : 0;

    return { items, totalAbonado: total, siguienteCuota: ultimaCuota + 1 };
  }

  async create(idPasajero: number, dto: CreatePagoDto) {
    await this.getPasajero(idPasajero);
    this.validarFecha(dto.fechaPago);
    await this.validarCuota(idPasajero, dto.numeroCuota);

    const pago = this.pagosRepository.create({
      ...dto,
      idPasajero,
      fechaPago: new Date(dto.fechaPago),
    });
    return this.pagosRepository.save(pago);
  }

  async update(id: number, dto: UpdatePagoDto) {
    const pago = await this.pagosRepository.findOneBy({ idPago: id });
    if (!pago) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }

    if (dto.fechaPago) {
      this.validarFecha(dto.fechaPago);
      pago.fechaPago = new Date(dto.fechaPago);
    }
    if (dto.numeroCuota !== undefined && dto.numeroCuota !== pago.numeroCuota) {
      await this.validarCuota(pago.idPasajero, dto.numeroCuota, pago.idPago);
      pago.numeroCuota = dto.numeroCuota;
    }
    if (dto.montoAbonado) pago.montoAbonado = dto.montoAbonado;

    return this.pagosRepository.save(pago);
  }

  private async getPasajero(idPasajero: number) {
    const pasajero = await this.pasajerosRepository.findOneBy({ idPasajero });
    if (!pasajero) {
      throw new NotFoundException(`Pasajero con id ${idPasajero} no encontrado`);
    }

    return pasajero;
  }

  private validarFecha(fechaPago: string) {
    if (new Date(fechaPago) > new Date()) {
      throw new BadRequestException('fechaPago no puede ser futura');
    }
  }

  // La tabla no tiene UNIQUE por cuota: se controla aca
  private async validarCuota(idPasajero: number, numeroCuota: number, idPagoExcluido?: number) {
    const existe = await this.pagosRepository.existsBy({
      idPasajero,
      numeroCuota,
      ...(idPagoExcluido ? { idPago: Not(idPagoExcluido) } : {}),
    });
    if (existe) {
      throw new ConflictException(`El pasajero ya tiene registrada la cuota ${numeroCuota}`);
    }
  }
}
