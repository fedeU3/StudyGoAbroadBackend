// Fecha sin hora, como la devuelve PostgreSQL para columnas DATE
export const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Monto decimal positivo con hasta 13 enteros y 2 decimales (DECIMAL(15, 2))
export const MONTO_REGEX = /^(?!0+(\.0+)?$)\d{1,13}(\.\d{1,2})?$/;

export const ESTADOS = ['A', 'B'];

// Fecha de hoy en formato YYYY-MM-DD
export function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}
