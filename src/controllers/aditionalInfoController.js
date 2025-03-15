const { calculateEA } = require('../services/invoiceService');

const getEA = async (req, res) => {
    try {
        const { month } = req.params;

        if (!month || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'El mes debe ser un número entre 1 y 12.' });
        }

        const ea = await calculateEA(parseInt(month));
        return res.status(200).json({ concepto: "Energía Activa (EA)", mes: month, valor: ea });
    } catch (error) {
        console.error(`Error calculando EA: ${error.message}`);
        return res.status(500).json({ error: 'Hubo un problema al calcular Energía Activa.' });
    }
};

module.exports = { getEA };