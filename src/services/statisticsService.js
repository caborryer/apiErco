const db = require('../database/connection');

const getConsumptionStatistics = async (clientId) => {
    try {
        const query = `
            SELECT 
                COALESCE(SUM(c.value), 0) AS total_consumption,
                COALESCE(AVG(c.value), 0) AS avg_consumption,
                COUNT(c.id_record) AS total_records
            FROM consumption c
            JOIN records r ON c.id_record = r.id_record
            JOIN xm_data_hourly_per_agent xm ON r.record_timestamp = xm.record_timestamp
            WHERE xm.value = $1;
        `;
        const result = await db.query(query, [clientId]);
        console.log('PASA')
        return {
            total: parseFloat(result.rows[0]?.total_consumption || 0).toFixed(2),
            promedio: parseFloat(result.rows[0]?.avg_consumption || 0).toFixed(2),
            registros: parseInt(result.rows[0]?.total_records || 0)
        };
    } catch (error) {
        console.error(`Error obteniendo estadísticas de consumo: ${error.message}`);
        throw error;
    }
};

const getInjectionStatistics = async (clientId) => {
    try {
        const query = `
            SELECT 
                COALESCE(SUM(i.value), 0) AS total_injection,
                COALESCE(AVG(i.value), 0) AS avg_injection,
                COUNT(i.id_record) AS total_records
            FROM injection i
            JOIN records r ON i.id_record = r.id_record
            WHERE r.client_id = $1;
        `; // preguntar de donde sale el clientId
        const result = await db.query(query, [clientId]);
        return {
            total: parseFloat(result.rows[0]?.total_injection || 0).toFixed(2),
            promedio: parseFloat(result.rows[0]?.avg_injection || 0).toFixed(2),
            registros: parseInt(result.rows[0]?.total_records || 0)
        };
    } catch (error) {
        console.error(`Error obteniendo estadísticas de inyección: ${error.message}`);
        throw error;
    }
};

module.exports = { getConsumptionStatistics, getInjectionStatistics };