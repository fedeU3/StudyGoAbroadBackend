import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

const DIAS_PASAPORTES_POR_VENCER = 180;

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) { }

  // Todos los indicadores en una sola consulta
  async getResumen() {
    const [fila] = await this.dataSource.query(
      `SELECT
        (SELECT COUNT(*) FROM "Pasajeros" WHERE "Estado" = 'A')::int AS "pasajerosActivos",
        (SELECT COUNT(*) FROM "Programa" WHERE "Estado" = 'A')::int AS "programasDisponibles",
        (SELECT COUNT(*) FROM "Viajes" v
           JOIN "Vuelos" vu ON vu."IdVuelo" = v."VueloInternacional"
           WHERE vu."Fecha" >= NOW())::int AS "proximosViajes",
        (SELECT COUNT(*) FROM "Vuelos" WHERE "Fecha" >= NOW())::int AS "proximosVuelos",
        (SELECT COUNT(*) FROM "Pagos"
           WHERE "FechaPago" >= date_trunc('month', NOW()))::int AS "pagosMesCantidad",
        (SELECT COALESCE(SUM("MontoAbonado"), 0) FROM "Pagos"
           WHERE "FechaPago" >= date_trunc('month', NOW()))::text AS "pagosMesMonto",
        (SELECT COUNT(*) FROM "Pagos")::int AS "pagosTotalCantidad",
        (SELECT COALESCE(SUM("MontoAbonado"), 0) FROM "Pagos")::text AS "pagosTotalMonto",
        (SELECT COUNT(*) FROM "Pasaportes"
           WHERE "Estado" = 'A'
             AND "FechaVencimiento" <= CURRENT_DATE + $1::int)::int AS "pasaportesPorVencer"`,
      [DIAS_PASAPORTES_POR_VENCER],
    );

    return {
      pasajerosActivos: fila.pasajerosActivos,
      programasDisponibles: fila.programasDisponibles,
      proximosViajes: fila.proximosViajes,
      proximosVuelos: fila.proximosVuelos,
      pagos: {
        mesActual: { cantidad: fila.pagosMesCantidad, monto: fila.pagosMesMonto },
        total: { cantidad: fila.pagosTotalCantidad, monto: fila.pagosTotalMonto },
      },
      pasaportesPorVencer: fila.pasaportesPorVencer,
    };
  }
}
