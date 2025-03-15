const { Client } = require('pg');

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

// Función general para ejecutar consultas SQL
const executeQuery = async (query, params) => {
    try {
        const res = await client.query(query, params);
        return res.rows;
    } catch (err) {
        console.error(`Error executing query: ${err.message}`);
    }
};

// Calcular Energía Activa (EA)
const calculateEA = async (month) => {
    const consumptionQuery = `
        SELECT SUM(value) AS total_energy
        FROM consumption
        WHERE DATE_PART('month', record_timestamp) = $1
    `;
    const tariffQuery = `
        SELECT CU
        FROM tariffs
        WHERE id_market = 1
    `;
    const consumptionResult = await executeQuery(consumptionQuery, [month]);
    const tariffResult = await executeQuery(tariffQuery, []);

    const totalEnergy = parseFloat(consumptionResult[0].total_energy || 0);
    const tariffCU = parseFloat(tariffResult[0].cu || 0);

    return totalEnergy * tariffCU;
};

// Calcular Comercialización de Excedentes de Energía (EC)
const calculateEC = async (month) => {
    const injectionQuery = `
        SELECT SUM(value) AS total_injection
        FROM injection
        WHERE DATE_PART('month', record_timestamp) = $1
    `;
    const tariffQuery = `
        SELECT C
        FROM tariffs
        WHERE id_market = 1
    `;
    const injectionResult = await executeQuery(injectionQuery, [month]);
    const tariffResult = await executeQuery(tariffQuery, []);

    const totalInjection = parseFloat(injectionResult[0].total_injection || 0);
    const tariffC = parseFloat(tariffResult[0].c || 0);

    return totalInjection * tariffC;
};

// Calcular Excedentes de Energía tipo 1 (EE1)
const calculateEE1 = async (month) => {
    const injectionQuery = `
        SELECT SUM(value) AS total_injection
        FROM injection
        WHERE DATE_PART('month', record_timestamp) = $1
    `;
    const consumptionQuery = `
        SELECT SUM(value) AS total_consumption
        FROM consumption
        WHERE DATE_PART('month', record_timestamp) = $1
    `;
    const tariffQuery = `
        SELECT -CU AS cu_negative
        FROM tariffs
        WHERE id_market = 1
    `;

    const injectionResult = await executeQuery(injectionQuery, [month]);
    const consumptionResult = await executeQuery(consumptionQuery, [month]);
    const tariffResult = await executeQuery(tariffQuery, []);

    const totalInjection = parseFloat(injectionResult[0].total_injection || 0);
    const totalConsumption = parseFloat(consumptionResult[0].total_consumption || 0);
    const cuNegative = parseFloat(tariffResult[0].cu_negative || 0);

    const ee1Quantity = totalInjection <= totalConsumption ? totalInjection : totalConsumption;
    return ee1Quantity * cuNegative;
};

// Calcular Excedentes de Energía tipo 2 (EE2)
const calculateEE2 = async (month) => {
    const injectionQuery = `
        SELECT SUM(value) AS total_injection
        FROM injection
        WHERE DATE_PART('month', record_timestamp) = $1
    `;
    const consumptionQuery = `
        SELECT SUM(value) AS total_consumption
        FROM consumption
        WHERE DATE_PART('month', record_timestamp) = $1
    `;
    const hourlyDataQuery = `
        SELECT record_timestamp, value AS hourly_value
        FROM xm_data_hourly_per_agent
        WHERE DATE_PART('month', record_timestamp) = $1
        ORDER BY record_timestamp
    `;

    const injectionResult = await executeQuery(injectionQuery, [month]);
    const consumptionResult = await executeQuery(consumptionQuery, [month]);
    const hourlyDataResult = await executeQuery(hourlyDataQuery, [month]);

    const totalInjection = parseFloat(injectionResult[0].total_injection || 0);
    const totalConsumption = parseFloat(consumptionResult[0].total_consumption || 0);
    let ee2Quantity = 0;
    let hourlyCost = 0;

    if (totalInjection > totalConsumption) {
        ee2Quantity = totalInjection - totalConsumption;

        let remainingEE2 = ee2Quantity;
        for (const { hourly_value } of hourlyDataResult) {
            const hourlyEE2 = Math.min(hourly_value, remainingEE2);
            hourlyCost += hourlyEE2 * hourly_value;
            remainingEE2 -= hourlyEE2;
            if (remainingEE2 <= 0) break;
        }
    }

    return hourlyCost;
};

const calculateInvoice = async (month) => {
    await connectToDatabase();

    const ea = await calculateEA(month);
    const ec = await calculateEC(month);
    const ee1 = await calculateEE1(month);
    const ee2 = await calculateEE2(month);

    await client.end();

    return { EA: ea, EC: ec, EE1: ee1, EE2: ee2 };
};

calculateInvoice(9).then((result) => console.log('Factura:', result)).catch((err) => console.error(err));