--
-- ER/Studio 8.0 SQL Code Generation
-- Company :      Federicos
-- Project :      StudyGoAbroad.dm1
-- Author :       Federico
--
-- Date Created : Friday, November 06, 2026 10:27:06
-- Target DBMS : MySQL 5.x
--

DROP TABLE Aeropuetos
;
DROP TABLE Ciudades
;
DROP TABLE Institucion
;
DROP TABLE MediosDePago
;
DROP TABLE Pagos
;
DROP TABLE Paises
;
DROP TABLE Pasajeros
;
DROP TABLE Pasaportes
;
DROP TABLE Programa
;
DROP TABLE Provincias
;
DROP TABLE Roles
;
DROP TABLE TiposProgramas
;
DROP TABLE Usuarios
;
DROP TABLE Viajes
;
DROP TABLE Vuelos
;
-- 
-- TABLE: Aeropuetos 
--

CREATE TABLE Aeropuetos(
    IdAeropuerto    INT             AUTO_INCREMENT,
    Aeropuerto      VARCHAR(120)    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Ciudades 
--

CREATE TABLE Ciudades(
    IdCiudad       INT             AUTO_INCREMENT,
    IdProvincia    INT             NOT NULL,
    Ciudad         VARCHAR(100)    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Institucion 
--

CREATE TABLE Institucion(
    IdInstitucion    INT             AUTO_INCREMENT,
    IdCiudad         INT             NOT NULL,
    IdProvincia      INT             NOT NULL,
    IdPais           INT             NOT NULL,
    Institucion      VARCHAR(100)    NOT NULL,
    Estado           CHAR(1)         NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: MediosDePago 
--

CREATE TABLE MediosDePago(
    IdMedioDePago    INT            AUTO_INCREMENT,
    MedioDePago      VARCHAR(30)    NOT NULL,
    Estado           CHAR(1)
)
COMMENT=''
;

-- 
-- TABLE: Pagos 
--

CREATE TABLE Pagos(
    IdPago           INT               AUTO_INCREMENT,
    IdPasajero       INT               NOT NULL,
    IdMedioDePago    INT               NOT NULL,
    NumeroCuota      INT               NOT NULL,
    MontoAbonado     DECIMAL(15, 2)    NOT NULL,
    FechaPago        DATETIME          NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Paises 
--

CREATE TABLE Paises(
    IdPais    INT            AUTO_INCREMENT,
    Pais      VARCHAR(50)    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Pasajeros 
--

CREATE TABLE Pasajeros(
    IdPasajero         INT             AUTO_INCREMENT,
    IdFactura          VARCHAR(100)    NOT NULL,
    IdPasaporte        INT,
    IdProvincia        INT             NOT NULL,
    IdCiudad           INT             NOT NULL,
    IdInstitucion      INT             NOT NULL,
    Nombres            VARCHAR(30)     NOT NULL,
    Apellido           VARCHAR(30)     NOT NULL,
    DNI                VARCHAR(8)      NOT NULL,
    FechaNacimiento    DATETIME        NOT NULL,
    Nacionalidad       VARCHAR(30)     NOT NULL,
    Domicilio          VARCHAR(120)    NOT NULL,
    Email              VARCHAR(120)    NOT NULL,
    Alergia            VARCHAR(120),
    Dieta              VARCHAR(120),
    Estado             CHAR(1)         NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Pasaportes 
--

CREATE TABLE Pasaportes(
    IdPasaporte         INT           AUTO_INCREMENT,
    PaisEmisor          INT           NOT NULL,
    NumeroPasaporte     VARCHAR(9)    NOT NULL,
    FechaVencimiento    DATETIME      NOT NULL,
    FechaEmision        DATETIME      NOT NULL,
    Estado              CHAR(1)       NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Programa 
--

CREATE TABLE Programa(
    IdPrograma              INT               AUTO_INCREMENT,
    IdTipoPrograma          INT               NOT NULL,
    PaisExcursion           INT               NOT NULL,
    PaisDestino             INT               NOT NULL,
    NombrePrograma          VARCHAR(50)       NOT NULL,
    DuracionPrograma        INT               NOT NULL,
    MontoTotalViaje         DECIMAL(15, 2)    NOT NULL,
    InstitucionReceptora    VARCHAR(100)      NOT NULL,
    Estado                  CHAR(1)           NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Provincias 
--

CREATE TABLE Provincias(
    IdProvincia    INT            AUTO_INCREMENT,
    Provincia      VARCHAR(20)    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Roles 
--

CREATE TABLE Roles(
    IdRol    INT            AUTO_INCREMENT,
    Rol      VARCHAR(20)    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: TiposProgramas 
--

CREATE TABLE TiposProgramas(
    IdTipoPrograma    INT            NOT NULL,
    TipoPrograma      VARCHAR(20)    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Usuarios 
--

CREATE TABLE Usuarios(
    IdUsuario    INT             AUTO_INCREMENT,
    IdRol        INT             NOT NULL,
    Usuario      VARCHAR(20)     NOT NULL,
    Token        VARCHAR(512)    NOT NULL,
    Password     CHAR(60)        NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Viajes 
--

CREATE TABLE Viajes(
    IdViaje               INT    AUTO_INCREMENT,
    IdPasajero            INT    NOT NULL,
    IdPrograma            INT    NOT NULL,
    VueloInternacional    INT    NOT NULL,
    VueloNacional         INT
)ENGINE=INNODB
COMMENT=''
;

-- 
-- TABLE: Vuelos 
--

CREATE TABLE Vuelos(
    IdVuelo              INT         AUTO_INCREMENT,
    AeropuertoOrigen     INT         NOT NULL,
    AeropuertoDestino    INT         NOT NULL,
    NumeroVuelo          CHAR(9)     NOT NULL,
    TipoVuelo            CHAR(1)     NOT NULL,
    Fecha                DATETIME    NOT NULL
)ENGINE=INNODB
COMMENT=''
;

-- 
-- INDEX: UI_Aeropuerto 
--

CREATE UNIQUE INDEX UI_Aeropuerto ON Aeropuetos(Aeropuerto)
;
-- 
-- INDEX: UI_Ciudad 
--

CREATE UNIQUE INDEX UI_Ciudad ON Ciudades(Ciudad)
;
-- 
-- INDEX: UI_Institucion 
--

CREATE UNIQUE INDEX UI_Institucion ON Institucion(Institucion)
;
-- 
-- INDEX: UI_Pais 
--

CREATE UNIQUE INDEX UI_Pais ON Paises(Pais)
;
-- 
-- INDEX: IE_IdFactura 
--

CREATE INDEX IE_IdFactura ON Pasajeros(IdFactura)
;
-- 
-- INDEX: UI_DNI 
--

CREATE UNIQUE INDEX UI_DNI ON Pasajeros(DNI)
;
-- 
-- INDEX: UI_IdFactura 
--

CREATE UNIQUE INDEX UI_IdFactura ON Pasajeros(IdFactura)
;
-- 
-- INDEX: UI_NumeroPasaporte 
--

CREATE UNIQUE INDEX UI_NumeroPasaporte ON Pasaportes(NumeroPasaporte)
;
-- 
-- INDEX: UI_NombrePrograma 
--

CREATE UNIQUE INDEX UI_NombrePrograma ON Programa(NombrePrograma)
;
-- 
-- INDEX: UI_Provincias 
--

CREATE UNIQUE INDEX UI_Provincias ON Provincias(Provincia)
;
-- 
-- INDEX: UI_TipoPrograma 
--

CREATE UNIQUE INDEX UI_TipoPrograma ON TiposProgramas(TipoPrograma)
;
-- 
-- INDEX: UI_Usuario 
--

CREATE UNIQUE INDEX UI_Usuario ON Usuarios(Usuario)
;
-- 
-- TABLE: Aeropuetos 
--

ALTER TABLE Aeropuetos ADD 
    PRIMARY KEY (IdAeropuerto)
;

-- 
-- TABLE: Ciudades 
--

ALTER TABLE Ciudades ADD 
    PRIMARY KEY (IdCiudad, IdProvincia)
;

-- 
-- TABLE: Institucion 
--

ALTER TABLE Institucion ADD 
    PRIMARY KEY (IdInstitucion)
;

-- 
-- TABLE: MediosDePago 
--

ALTER TABLE MediosDePago ADD 
    PRIMARY KEY (IdMedioDePago)
;

-- 
-- TABLE: Pagos 
--

ALTER TABLE Pagos ADD 
    PRIMARY KEY (IdPago, IdPasajero)
;

-- 
-- TABLE: Paises 
--

ALTER TABLE Paises ADD 
    PRIMARY KEY (IdPais)
;

-- 
-- TABLE: Pasajeros 
--

ALTER TABLE Pasajeros ADD 
    PRIMARY KEY (IdPasajero)
;

-- 
-- TABLE: Pasaportes 
--

ALTER TABLE Pasaportes ADD 
    PRIMARY KEY (IdPasaporte)
;

-- 
-- TABLE: Programa 
--

ALTER TABLE Programa ADD 
    PRIMARY KEY (IdPrograma)
;

-- 
-- TABLE: Provincias 
--

ALTER TABLE Provincias ADD 
    PRIMARY KEY (IdProvincia)
;

-- 
-- TABLE: Roles 
--

ALTER TABLE Roles ADD 
    PRIMARY KEY (IdRol)
;

-- 
-- TABLE: TiposProgramas 
--

ALTER TABLE TiposProgramas ADD 
    PRIMARY KEY (IdTipoPrograma)
;

-- 
-- TABLE: Usuarios 
--

ALTER TABLE Usuarios ADD 
    PRIMARY KEY (IdUsuario)
;

-- 
-- TABLE: Viajes 
--

ALTER TABLE Viajes ADD 
    PRIMARY KEY (IdViaje, IdPasajero, IdPrograma)
;

-- 
-- TABLE: Vuelos 
--

ALTER TABLE Vuelos ADD 
    PRIMARY KEY (IdVuelo)
;

-- 
-- TABLE: Ciudades 
--

ALTER TABLE Ciudades ADD CONSTRAINT RefProvincias26 
    FOREIGN KEY (IdProvincia)
    REFERENCES Provincias(IdProvincia)
;


-- 
-- TABLE: Institucion 
--

ALTER TABLE Institucion ADD CONSTRAINT RefCiudades8 
    FOREIGN KEY (IdCiudad, IdProvincia)
    REFERENCES Ciudades(IdCiudad, IdProvincia)
;

ALTER TABLE Institucion ADD CONSTRAINT RefProvincias9 
    FOREIGN KEY (IdProvincia)
    REFERENCES Provincias(IdProvincia)
;

ALTER TABLE Institucion ADD CONSTRAINT RefPaises10 
    FOREIGN KEY (IdPais)
    REFERENCES Paises(IdPais)
;


-- 
-- TABLE: Pagos 
--

ALTER TABLE Pagos ADD CONSTRAINT RefPasajeros13 
    FOREIGN KEY (IdPasajero)
    REFERENCES Pasajeros(IdPasajero)
;

ALTER TABLE Pagos ADD CONSTRAINT RefMediosDePago27 
    FOREIGN KEY (IdMedioDePago)
    REFERENCES MediosDePago(IdMedioDePago)
;


-- 
-- TABLE: Pasajeros 
--

ALTER TABLE Pasajeros ADD CONSTRAINT RefPasaportes21 
    FOREIGN KEY (IdPasaporte)
    REFERENCES Pasaportes(IdPasaporte)
;

ALTER TABLE Pasajeros ADD CONSTRAINT RefProvincias1 
    FOREIGN KEY (IdProvincia)
    REFERENCES Provincias(IdProvincia)
;

ALTER TABLE Pasajeros ADD CONSTRAINT RefCiudades2 
    FOREIGN KEY (IdProvincia, IdCiudad)
    REFERENCES Ciudades(IdCiudad, IdProvincia)
;

ALTER TABLE Pasajeros ADD CONSTRAINT RefInstitucion11 
    FOREIGN KEY (IdInstitucion)
    REFERENCES Institucion(IdInstitucion)
;


-- 
-- TABLE: Pasaportes 
--

ALTER TABLE Pasaportes ADD CONSTRAINT RefPaises22 
    FOREIGN KEY (PaisEmisor)
    REFERENCES Paises(IdPais)
;


-- 
-- TABLE: Programa 
--

ALTER TABLE Programa ADD CONSTRAINT RefTiposProgramas23 
    FOREIGN KEY (IdTipoPrograma)
    REFERENCES TiposProgramas(IdTipoPrograma)
;

ALTER TABLE Programa ADD CONSTRAINT RefPaises3 
    FOREIGN KEY (PaisDestino)
    REFERENCES Paises(IdPais)
;

ALTER TABLE Programa ADD CONSTRAINT RefPaises5 
    FOREIGN KEY (PaisExcursion)
    REFERENCES Paises(IdPais)
;


-- 
-- TABLE: Usuarios 
--

ALTER TABLE Usuarios ADD CONSTRAINT RefRoles20 
    FOREIGN KEY (IdRol)
    REFERENCES Roles(IdRol)
;


-- 
-- TABLE: Viajes 
--

ALTER TABLE Viajes ADD CONSTRAINT RefPrograma14 
    FOREIGN KEY (IdPrograma)
    REFERENCES Programa(IdPrograma)
;

ALTER TABLE Viajes ADD CONSTRAINT RefVuelos15 
    FOREIGN KEY (VueloInternacional)
    REFERENCES Vuelos(IdVuelo)
;

ALTER TABLE Viajes ADD CONSTRAINT RefVuelos16 
    FOREIGN KEY (VueloNacional)
    REFERENCES Vuelos(IdVuelo)
;

ALTER TABLE Viajes ADD CONSTRAINT RefPasajeros12 
    FOREIGN KEY (IdPasajero)
    REFERENCES Pasajeros(IdPasajero)
;


-- 
-- TABLE: Vuelos 
--

ALTER TABLE Vuelos ADD CONSTRAINT RefAeropuetos18 
    FOREIGN KEY (AeropuertoOrigen)
    REFERENCES Aeropuetos(IdAeropuerto)
;

ALTER TABLE Vuelos ADD CONSTRAINT RefAeropuetos19 
    FOREIGN KEY (AeropuertoDestino)
    REFERENCES Aeropuetos(IdAeropuerto)
;
