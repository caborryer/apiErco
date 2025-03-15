const express = require('express');
const { getSystemLoadHandler } = require('../controllers/systemLoadController');

const router = express.Router();

/**
 * @swagger
 * /system-load:
 *   get:
 *     summary: Muestra la carga del sistema por hora basada en los datos de consumo
 *     description: Devuelve una lista con las cargas por hora, calculadas desde los datos de consumo.
 *     responses:
 *       200:
 *         description: Carga del sistema calculada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carga_del_sistema_por_hora:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hora:
 *                         type: string
 *                         format: date-time
 *                         description: Hora truncada.
 *                         example: "2023-09-01T03:00:00.000Z"
 *                       consumo_total:
 *                         type: number
 *                         description: Total de consumo en kWh para esa hora específica.
 *                         example: 123.45
 *       500:
 *         description: Error interno del servidor al obtener la carga del sistema.
 */
router.get('/system-load', getSystemLoadHandler);

module.exports = router;