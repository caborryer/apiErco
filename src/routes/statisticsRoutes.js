const express = require('express');
const { getClientStatistics } = require('../controllers/statisticsController');

const router = express.Router();

/**
 * @swagger
 * /client-statistics/{client_id}:
 *   get:
 *     summary: Obtiene estadísticas de consumo e inyección para un cliente
 *     description: Devuelve estadísticas como el total, promedio y número de registros de consumo e inyección.
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Estadísticas calculadas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cliente:
 *                   type: object
 *                   description: Información del cliente
 *                 estadisticas:
 *                   type: object
 *                   description: Estadísticas de consumo e inyección
 *       400:
 *         description: Error de validación en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.get('/client-statistics/:client_id', getClientStatistics);

module.exports = router;