const { Client } = require('pg');
const csv = require('csv-parser'); 
const fs = require('fs'); 
const path = require('path');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5434,
});

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL.');
    } catch (err) {
        console.error('There is an error with PostgreSQL connection:', err.message);
        process.exit(1);
    }
};


const cleanValue = (value, defaultValue = 0) => {
    return value === '' ? defaultValue : value;
};

const loadCsvToTable = (csvFilePath, tableName, columns) => {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const cleanedRow = columns.map((col) => cleanValue(row[col]));
                rows.push(cleanedRow);
            })
            .on('end', async () => {
                console.log(`Procesing ${rows.length} rows for table "${tableName}".`);

                for (const row of rows) {
                    try {
                        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
                        const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

                        await client.query(sql, row);
                        console.log(`Insert in table ${tableName}: ${JSON.stringify(row)}`);
                    } catch (err) {
                        console.error(`There is an error in insert in table ${tableName}: ${err.message}`);
                    }
                }

                resolve();
            })
            .on('error', (err) => {
                console.error(`There is an error reading the CSV: ${err}`);
                reject(err);
            });
    });
};

const tablesAndFiles = [
    { table: 'services', file: path.resolve(__dirname, '../data/services.csv'), columns: ['id_service', 'id_market', 'cdi', 'voltage_level'] },
    { table: 'tariffs', file: path.resolve(__dirname, '../data/tariffs.csv'), columns: ['id_market', 'voltage_level', 'cdi', 'G', 'T', 'D', 'R', 'C', 'P', 'CU'] },
    { table: 'records', file: path.resolve(__dirname, '../data/records.csv'), columns: ['id_record', 'id_service', 'record_timestamp'] },
    { table: 'consumption', file: path.resolve(__dirname, '../data/consumption.csv'), columns: ['id_record', 'value'] },
    { table: 'injection', file: path.resolve(__dirname, '../data/injection.csv'), columns: ['id_record', 'value'] },
    { table: 'xm_data_hourly_per_agent', file: path.resolve(__dirname, '../data/xm_data_hourly_per_agent.csv'), columns: ['record_timestamp', 'value'] },
  ];

const loadAllTables = async () => {
    await connectToDatabase();

    for (const { table, file, columns } of tablesAndFiles) {
        console.log(`Loading data into table "${table}" from file "${file}"...`);
        try {
            await loadCsvToTable(file, table, columns);
        } catch (err) {
            console.error(`Error loading data into table "${table}": ${err.message}`);
        }
    }

    await client.end();
    console.log('Data upload completed and connection closed.');
};

loadAllTables().catch((err) => console.error('Error loading tables:', err));