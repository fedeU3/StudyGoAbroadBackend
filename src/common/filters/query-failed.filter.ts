import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

// Mensajes por indice UNIQUE del script de base de datos
const UNIQUE_MESSAGES: Record<string, string> = {
  UI_DNI: 'Ya existe un pasajero con ese DNI',
  UI_Email: 'Ya existe un pasajero con ese email',
  UI_IdFactura: 'Ya existe un pasajero con esa factura',
  UI_NumeroPasaporte: 'Ya existe un pasaporte con ese número',
  UI_NombrePrograma: 'Ya existe un programa con ese nombre',
  UI_Institucion: 'Ya existe una institución con ese nombre',
  UI_Aeropuerto: 'Ya existe un aeropuerto con ese nombre',
  UI_Usuario: 'Ya existe un usuario con ese nombre',
};

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const driverError = exception.driverError as {
      code?: string;
      constraint?: string;
      detail?: string;
    };

    // 23505: violacion de UNIQUE
    if (driverError.code === '23505') {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message:
          UNIQUE_MESSAGES[driverError.constraint ?? ''] ??
          'Ya existe un registro con esos datos',
        error: 'Conflict',
      });
    }

    // 23503: la FK apunta a un registro que no existe
    if (driverError.code === '23503') {
      const match = /Key \((\w+)\)=\((.*?)\)/.exec(driverError.detail ?? '');
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: match
          ? `No existe el registro referenciado por ${match[1]} = ${match[2]}`
          : 'El registro referenciado no existe',
        error: 'Not Found',
      });
    }

    // 22001: valor mas largo que la columna
    if (driverError.code === '22001') {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Un valor supera el largo permitido',
        error: 'Bad Request',
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
      error: 'Internal Server Error',
    });
  }
}
