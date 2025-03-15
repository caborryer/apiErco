const { calculateEA, calculateEC, calculateEE1, calculateEE2, getTariff, getTotalEnergy } = require('../services/invoiceService');

const calculateInvoice = async (req, res) => {
    try {
        const { month } = req.body;

        if (!month || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'El mes debe ser un número entre 1 y 12.' });
        }

        const ea = await calculateEA(month); 
        const ec = await calculateEC(month);
        const ee1 = await calculateEE1(month);
        const ee1Cost = ee1 * (await getTariff('CU', month) * -1);
        const ee2 = await calculateEE2(month);

        const totalCost = parseFloat((ea + ec + ee1Cost + ee2).toFixed(2));

        return res.status(200).json({
            factura: {
                mes: month,
                detalles: {
                    energia_activa: {
                        descripcion: "Energía Activa (EA)",
                        cantidad: parseFloat((await getTotalEnergy('consumption', month)).toFixed(2)),
                        tarifa: parseFloat((await getTariff('CU', month)).toFixed(2)),
                        subtotal: ea,
                        unidad: "kWh",
                        costo_unitario: "$/kWh"
                    },
                    comercializacion_excedentes: {
                        descripcion: "Comercialización de Excedentes de Energía (EC)",
                        cantidad: parseFloat((await getTotalEnergy('injection', month)).toFixed(2)),
                        tarifa: parseFloat((await getTariff('C', month)).toFixed(2)),
                        subtotal: ec,
                        unidad: "kWh",
                        costo_unitario: "$/kWh"
                    },
                    excedentes_tipo_1: {
                        descripcion: "Excedentes de Energía Tipo 1 (EE1)",
                        cantidad: ee1,
                        tarifa: parseFloat((await getTariff('CU', month) * -1).toFixed(2)),
                        subtotal: parseFloat(ee1Cost.toFixed(2)),
                        unidad: "kWh",
                        costo_unitario: "$/kWh"
                    },
                    excedentes_tipo_2: {
                        descripcion: "Excedentes de Energía Tipo 2 (EE2)",
                        cantidad: ee2 > 0 ? "Calculado por hora" : "0",
                        subtotal: ee2,
                        unidad: "kWh",
                        costo_unitario: "$/kWh"
                    }
                },
                totales: {
                    total_factura: totalCost,
                    moneda: "COP"
                }
            }
        });
    } catch (error) {
        console.error('Error calculando la factura:', error.message);
        return res.status(500).json({ error: 'Hubo un problema al calcular la factura.' });
    }
};

module.exports = { calculateInvoice };