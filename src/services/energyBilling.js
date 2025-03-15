const db = require('../database/connection');

const getTotalEnergy = async (table, month) => {
    try {
        const query = `
            SELECT SUM(value) AS total_energy
            FROM ${table} c
            JOIN records r ON c.id_record = r.id_record
            WHERE DATE_PART('month', r.record_timestamp) = $1
        `;
        const result = await db.query(query, [month]);
        return parseFloat(result.rows[0]?.total_energy || 0);
    } catch (error) {
        console.error(`Error en getTotalEnergy (${table}): ${error.message}`);
        throw error;
    }
};

const getTariff = async (tariffType, month) => {
    try {
        const query = `
            SELECT t.${tariffType} AS tariff
            FROM tariffs t
            JOIN services s ON t.id_market = s.id_market
            JOIN records r ON r.id_service = s.id_service
            WHERE DATE_PART('month', r.record_timestamp) = $1
              AND t.voltage_level = s.voltage_level
              AND (t.cdi = s.cdi OR t.cdi IS NULL)
            LIMIT 1
        `;
        const result = await db.query(query, [month]);
        return parseFloat(result.rows[0]?.tariff || 0);
    } catch (error) {
        console.error(`Error en getTariff (${tariffType}): ${error.message}`);
        throw error;
    }
};

const calculateEA = async (month) => {
    try {
        const totalEnergy = await getTotalEnergy('consumption', month);

        const tariffCU = await getTariff('CU', month);

        if (!totalEnergy) throw new Error("No se encontraron datos de consumo para el mes especificado.");
        if (!tariffCU) throw new Error("No se encontró una tarifa CU aplicable.");

        console.log(`Total Energy (EA): ${totalEnergy}, Tarifa CU: ${tariffCU}`);

        return parseFloat((totalEnergy * tariffCU).toFixed(2));
    } catch (error) {
        console.error(`Error en calculateEA: ${error.message}`);
        throw error;
    }
};

const calculateEC = async (month) => {
    try {
        const totalInjection = await getTotalEnergy('injection', month);

        const tariffC = await getTariff('C', month);

        if (!totalInjection) throw new Error("No se encontraron datos de inyección para el mes especificado.");
        if (!tariffC) throw new Error("No se encontró una tarifa C aplicable.");

        console.log(`Total Injection (EC): ${totalInjection}, Tarifa C: ${tariffC}`);

        return parseFloat((totalInjection * tariffC).toFixed(2));
    } catch (error) {
        console.error(`Error en calculateEC: ${error.message}`);
        throw error;
    }
};

const calculateEE1 = async (month) => {
    try {
        const totalConsumption = await getTotalEnergy('consumption', month);
        console.log('totalConsumption', totalConsumption )

        const totalInjection = await getTotalEnergy('injection', month);
        console.log('totalInjection', totalInjection )

        const negativeCU = await getTariff('CU', month) * -1;

        if (!negativeCU) throw new Error("No se encontró una tarifa CU negativa aplicable.");

        console.log(`Inyección total: ${totalInjection}, Consumo total: ${totalConsumption}, Tarifa CU negativa: ${negativeCU}`);

        const totalEE1 = totalInjection <= totalConsumption ? totalInjection : totalConsumption;

        // return totalEE1 * negativeCU; // se debe multiplicar por el negativo cu SI ES EL COSTO
        return parseFloat(totalEE1.toFixed(2));

    } catch (error) {
        console.error(`Error en calculateEE1: ${error.message}`);
        throw error;
    }
};

const calculateEE2 = async (month) => {
    try {
        const totalConsumption = await getTotalEnergy('consumption', month);

        const totalInjection = await getTotalEnergy('injection', month);

        if (totalInjection <= totalConsumption) {
            console.log(`No hay excedentes de energía tipo 2 (EE2) porque la inyección no supera el consumo.`);
            return 0;
        }

        const totalEE2 = totalInjection - totalConsumption;

        console.log(`Cantidad total de EE2: ${totalEE2} kWh`);

        // Consulta para obtener tarifas por hora desde xm_data_hourly_per_agent
        const hourlyQuery = `
            SELECT r.record_timestamp, x.value AS hourly_tariff, 
                   i.value AS hourly_injection, 
                   c.value AS hourly_consumption
            FROM xm_data_hourly_per_agent x
            JOIN records r ON x.record_timestamp = r.record_timestamp
            JOIN injection i ON i.id_record = r.id_record
            JOIN consumption c ON c.id_record = r.id_record
            WHERE DATE_PART('month', r.record_timestamp) = $1
            ORDER BY r.record_timestamp ASC
        `;
        const hourlyResult = await db.query(hourlyQuery, [month]);

        let cumulativeEE2 = 0;
        let cumulativeCost = 0;

        for (const row of hourlyResult.rows) {
            const hourlyExcess = Math.max(0, row.hourly_injection - row.hourly_consumption);

            const usedEE2 = Math.min(hourlyExcess, totalEE2 - cumulativeEE2);

            cumulativeCost += usedEE2 * row.hourly_tariff;
            cumulativeEE2 += usedEE2;

            if (cumulativeEE2 >= totalEE2) break;
        }

        console.log(`Costo acumulado EE2: ${cumulativeCost} \$`);

        return parseFloat((cumulativeCost).toFixed(2));

    } catch (error) {
        console.error(`Error en calculateEE2: ${error.message}`);
        throw error;
    }
};

module.exports = { calculateEA, calculateEC, calculateEE1, calculateEE2, getTariff, getTotalEnergy };