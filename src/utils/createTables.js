const { query } = require('./connection');

const createTablesSQL = `
-- Tabla: services
CREATE TABLE IF NOT EXISTS services (
    id_service INTEGER PRIMARY KEY,
    id_market INTEGER,
    cdi INTEGER,
    voltage_level INTEGER
);

-- Tabla: tariffs
CREATE TABLE IF NOT EXISTS tariffs (
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

-- Tabla: records
CREATE TABLE IF NOT EXISTS records (
    id_record INTEGER PRIMARY KEY,
    id_service INTEGER,
    record_timestamp TIMESTAMP,
    FOREIGN KEY (id_service) REFERENCES services(id_service)
);

-- Tabla: injection
CREATE TABLE IF NOT EXISTS injection (
    id_record INTEGER PRIMARY KEY,
    value FLOAT,
    FOREIGN KEY (id_record) REFERENCES records(id_record)
);

-- Tabla: consumption
CREATE TABLE IF NOT EXISTS consumption (
    id_record INTEGER PRIMARY KEY,
    value FLOAT,
    FOREIGN KEY (id_record) REFERENCES records(id_record)
);

-- Tabla: xm_data_hourly_per_agent
CREATE TABLE IF NOT EXISTS xm_data_hourly_per_agent (
    record_timestamp TIMESTAMP,
    value FLOAT
);
`;

const createTables = async () => {
    try {
        console.log('Creando tablas en la base de datos...');
        await query(createTablesSQL);
        console.log('Tablas creadas exitosamente.');
    } catch (error) {
        console.error('Error al crear las tablas:', error.message);
    }
};

createTables();