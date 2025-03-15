const express = require('express');
const { getEA } = require('../controllers/aditionalInfoController');

const router = express.Router();

/**
 * @swagger
 * /ea/{month}:
 *   get:
 *     summary: Calcula la Energía Activa (EA) para un mes específico
 *     description: Devuelve el cálculo de Energía Activa basado en el consumo total y la tarifa CU para un mes específico.
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: El mes para el cual se calculará la Energía Activa (EA).
 *         example: 9
 *     responses:
 *       200:
 *         description: Energía Activa calculada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 concepto:
 *                   type: string
 *                   description: Concepto calculado.
 *                   example: "Energía Activa (EA)"
 *                 mes:
 *                   type: integer
 *                   description: El mes solicitado.
 *                   example: 9
 *                 valor:
 *                   type: number
 *                   format: float
 *                   description: Valor total de Energía Activa calculada.
 *                   example: 833855.50
 *       400:
 *         description: Error de validación en la solicitud (mes no válido).
 *       500:
 *         description: Error interno del servidor al calcular Energía Activa.
 */
router.get('/ea/:month', getEA);

module.exports = router;