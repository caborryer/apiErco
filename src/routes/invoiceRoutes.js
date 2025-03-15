const express = require('express');
const { calculateInvoice } = require('../controllers/invoiceController');

const router = express.Router();

router.post('/calculate-invoice', calculateInvoice);

module.exports = router;