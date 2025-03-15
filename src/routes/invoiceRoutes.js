const express = require('express');
const { calculateInvoice } = require('../controllers/invoiceController');

const router = express.Router();

/**
 * @swagger
 * /calculate-invoice:
 *   post:
 *     summary: Calcula la factura de un cliente para un mes específico
 *     description: Calcula los valores de Energía Activa, Comercialización de Excedentes, Excedentes Tipo 1 y Tipo 2.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 description: Mes para el que se calculará la factura.
 *                 example: 9
 *     responses:
 *       200:
 *         description: Factura calculada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 factura:
 *                   type: object
 *                   description: Detalles de la factura
 *       400:
 *         description: Error de validación en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.post('/calculate-invoice', calculateInvoice);

module.exports = router;