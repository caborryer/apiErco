-- Tabla: services
CREATE TABLE services (
    id_service INTEGER PRIMARY KEY,
    id_market INTEGER,
    cdi INTEGER,
    voltage_level INTEGER
);

-- Tabla: Tariffs
CREATE TABLE tariffs (
    id_market INTEGER,
    voltage_level INTEGER,
    cdi INTEGER,
    G FLOAT,
    T FLOAT,
    D FLOAT,
    R FLOAT,
    C FLOAT,
    P FLOAT,
    CU FLOAT,
    PRIMARY KEY (id_market, voltage_level, cdi)
);

-- Tabla: Records
CREATE TABLE records (
    id_record INTEGER PRIMARY KEY,
    id_service INTEGER,
    record_timestamp TIMESTAMP,
    FOREIGN KEY (id_service) REFERENCES services(id_service)
);

-- Tabla: Injection
CREATE TABLE injection (
    id_record INTEGER PRIMARY KEY,
    value FLOAT,
    FOREIGN KEY (id_record) REFERENCES records(id_record)
);

-- Tabla: consumption
CREATE TABLE consumption (
    id_record INTEGER PRIMARY KEY,
    value FLOAT,
    FOREIGN KEY (id_record) REFERENCES records(id_record)
);

-- Tabla: xm_data_hourly_per_agent
CREATE TABLE xm_data_hourly_per_agent (
    record_timestamp TIMESTAMP,
    value FLOAT
);