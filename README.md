# StudyGoAbroad — Backend

<p align="left">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-0.3.20-FE0803?style=flat-square" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
</p>

Esta es la API REST de **StudyGoAbroad**, un sistema para gestionar viajes de estudio. Maneja pasajeros, pasaportes, instituciones, programas, vuelos, viajes y pagos en cuotas, con autenticación JWT y dos roles: lector y editor.

El frontend está en el repositorio `StudyGoAbroadFrontend` (React + Vite).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 (Express) |
| Lenguaje | TypeScript 5.7 |
| ORM | TypeORM 0.3.20 + `@nestjs/typeorm` |
| Base de datos | PostgreSQL en Supabase |
| Auth | `@nestjs/jwt` + Passport JWT + bcryptjs |
| Validación | class-validator + class-transformer |
| Tests | Jest + ts-jest |
| Calidad | ESLint 9 (flat config) + Prettier |

---

## Puesta en marcha

### Requisitos

- Node.js 22.x
- Una base PostgreSQL. El proyecto usa Supabase, pero cualquier Postgres sirve.

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copiá `example.env` a `.env` y completá los valores:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Connection string de Postgres. En Supabase va el pooler en modo sesión (puerto 5432). |
| `JWT_SECRET` | Sí | Secreto con el que se firman los tokens |
| `JWT_EXPIRE` | No | Duración del token (por defecto `1h`) |
| `PORT` | No | Puerto HTTP (por defecto `3000`) |

### 3. Crear la base de datos

TypeORM **no** crea ni migra el esquema. Los scripts están en `database/` y se ejecutan en este orden:

1. `seed inicial.postgres`: borra y recrea todas las tablas en el schema `public` y carga los catálogos (roles, países, provincias, ciudades, medios de pago, etc.).
2. `seed poblacional.postgres`: carga datos de prueba (pasajeros, pasaportes, instituciones, pagos, etc.). Es opcional.

```bash
psql "$DATABASE_URL" -f "database/seed inicial.postgres"
psql "$DATABASE_URL" -f "database/seed poblacional.postgres"
```

> ⚠️ El seed inicial hace `DROP TABLE ... CASCADE`, así que borra todos los datos existentes.

`seed inicial mysql.sql` es el script original exportado de ER/Studio. Se guarda solo como referencia.

### 4. Levantar la API

```bash
npm run start:dev
```

Para comprobar que funciona: `GET /home` → `{ ok: true, message: "API funcionando ✅" }`.

---

## Scripts

| Script | Descripción |
|---|---|
| `npm run start:dev` | Desarrollo con recarga automática |
| `npm run start:debug` | Desarrollo con debugger |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Ejecuta `dist/main` |
| `npm run lint` | ESLint con autofix |
| `npm run format` | Prettier |
| `npm run test` | Tests unitarios (`src/**/*.spec.ts`) |
| `npm run test:cov` | Tests con cobertura |

---

## API

La documentación completa (OpenAPI 3) está en [`swagger api-studygoabroad backend.yaml`](./swagger%20api-studygoabroad%20backend.yaml). Se puede abrir en [editor.swagger.io](https://editor.swagger.io) o con cualquier visor de OpenAPI.

### Reglas generales

- **Autenticación:** todas las rutas, salvo `POST /auth/login` y `GET /home`, requieren el header `Authorization: Bearer <token>`.
- **Roles:**
  - Los `GET` los pueden usar `LECTOR` y `EDITOR`.
  - Los `POST` y `PATCH` son solo para `EDITOR`.
  - Excepciones: `/auth/me` y `/auth/password` los puede usar cualquier usuario logueado, y `/usuarios` es solo para `EDITOR`, incluidos los `GET`.
- **Baja lógica:** no hay `DELETE`. Para dar de baja un registro se envía `PATCH` con `{ "estado": "B" }` (`A` = activo, `B` = baja). Los listados devuelven solo registros activos, salvo que se pase `?incluirBajas=true`.
- **Paginación:** los listados principales aceptan `?page=` (por defecto 1) y `?limit=` (por defecto 20, máximo 100). La respuesta tiene la forma `{ items, total, page, limit }`.
- **Formatos:**
  - Fechas sin hora: `YYYY-MM-DD`.
  - Fechas con hora: ISO 8601 (`2026-03-15T14:30:00`).
  - Montos: string decimal (`"1500.00"`).
- **Errores:**
  - Los mensajes vienen en español.
  - Un dato duplicado (UNIQUE) devuelve `409`.
  - Una referencia a un registro que no existe (FK) devuelve `404`.
  - Un campo no declarado en el DTO o un valor demasiado largo devuelve `400`.

### Endpoints

| Recurso | Endpoints |
|---|---|
| Auth | `POST /auth/login` · `GET /auth/me` · `PATCH /auth/password` |
| Usuarios | `GET /usuarios` · `PATCH /usuarios/:id` |
| Dashboard | `GET /dashboard`: pasajeros activos, programas, próximos viajes y vuelos, pagos del mes y totales, pasaportes que vencen en los próximos 180 días |
| Pasajeros | `GET /pasajeros` · `GET /pasajeros/:id` · `POST /pasajeros` · `PATCH /pasajeros/:id` |
| Pasaportes | `GET /pasaportes/por-vencer` · `GET/POST/PATCH /pasajeros/:id/pasaporte` |
| Pagos | `GET/POST /pasajeros/:id/pagos` · `PATCH /pagos/:id` |
| Viajes | `GET/POST /pasajeros/:id/viajes` · `GET /programas/:id/viajes` · `GET/PATCH /viajes/:id` |
| Instituciones | `GET /instituciones` · `GET /instituciones/:id` · `GET /instituciones/:id/pasajeros` · `POST` · `PATCH /:id` |
| Programas | `GET /programas` · `GET /programas/:id` · `POST` · `PATCH /:id` |
| Vuelos | `GET /vuelos` · `GET /vuelos/:id` · `POST` · `PATCH /:id` |
| Aeropuertos | `GET /aeropuertos` · `POST` · `PATCH /:id` |
| Catálogos (solo lectura) | `GET /paises` · `GET /provincias` · `GET /ciudades` · `GET /roles` · `GET /tipos-programas` |

---

## Estructura del proyecto

```
.
├── database/                 Scripts SQL (seed inicial + poblacional)
├── src/
│   ├── main.ts               Bootstrap: CORS, ValidationPipe global, QueryFailedFilter
│   ├── app.module.ts         Conexión TypeORM y registro de módulos
│   ├── auth/                 Login, JWT strategy, @Auth(), @Roles(), RolesGuard
│   ├── common/
│   │   ├── dto/              PaginationQueryDto, EstadoQueryDto
│   │   ├── filters/          Traducción de errores de Postgres a HTTP
│   │   └── validators/       Regex de fecha y monto, helpers
│   ├── home/                 Health check
│   ├── dashboard/            Resumen de indicadores
│   └── <recurso>/            Un módulo por recurso:
│       ├── <recurso>.module.ts
│       ├── <recurso>.entity.ts
│       ├── <recurso>.service.ts
│       ├── <recurso>.controller.ts
│       └── dto/              create-*, update-*, *-query
└── swagger api-studygoabroad backend.yaml
```

---

## Flujo de trabajo

- Ramas: `<idTareaClickUp>_<usuario>_<Descripcion>`, por ejemplo `86e3zaa7d_fhuespe_Ciudades_Provincias_Medios_De_Pago`.
- Commits en español con prefijo `feat:` o `fix:`.
- Todo cambio entra a `main` por Pull Request.
- Si cambia la API, hay que actualizar el swagger. Si cambia el esquema, hay que actualizar el seed SQL y la entity.

---

## Licencia

Privado — UNLICENSED.
