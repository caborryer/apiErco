const db = require('../database/connection');

const getSystemLoad = async () => {
    try {
        const query = `
            SELECT
                DATE_TRUNC('hour', r.record_timestamp) AS hora,
                SUM(c.value) AS consumo_total
            FROM 
                consumption c
            JOIN 
                records r ON c.id_record = r.id_record
            GROUP BY 
                hora
            ORDER BY 
                hora ASC;
        `;

        const result = await db.query(query);
        return result.rows.map(row => ({
            hora: row.hora,
            consumo_total: parseFloat(row.consumo_total).toFixed(2)
        }));

    } catch (error) {
        console.error(`Error al obtener la carga del sistema: ${error.message}`);
        throw error;
    }
};

module.exports = { getSystemLoad };