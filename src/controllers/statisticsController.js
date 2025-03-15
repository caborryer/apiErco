const { getConsumptionStatistics, getInjectionStatistics } = require('../services/statisticsService');


const getClientStatistics = async (req, res) => {
    try {
        const { client_id } = req.params;

        if (!client_id) {
            return res.status(400).json({ error: "El ID del cliente es obligatorio." });
        }

        const consumptionStats = await getConsumptionStatistics(client_id);
        const injectionStats = await getInjectionStatistics(client_id);

        return res.status(200).json({
            cliente: {
                id: client_id
            },
            estadisticas: {
                consumo: consumptionStats,
                inyeccion: injectionStats
            }
        });
    } catch (error) {
        console.error('Error obteniendo las estadísticas del cliente:', error.message);
        return res.status(500).json({ error: 'Hubo un problema al calcular las estadísticas del cliente.' });
    }
};

module.exports = { getClientStatistics };