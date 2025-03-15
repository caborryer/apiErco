const express = require('express');
const bodyParser = require('body-parser');
const invoiceRoutes = require('./src/routes/invoiceRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api', invoiceRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error.' });
});

app.listen(PORT, () => {
    console.log(`Service start on http://localhost:${PORT}`);
});