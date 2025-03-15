const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const statisticsRoutes = require('./src/routes/statisticsRoutes');
const systemLoad = require('./src/routes/systemLoadRoutes');
const aditionalInfo = require('./src/routes/aditionalInfoRoutes');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', invoiceRoutes);
app.use('/api', statisticsRoutes);
app.use('/api', systemLoad);
app.use('/api', aditionalInfo);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error.' });
});

app.listen(PORT, () => {
    console.log(`Service start on http://localhost:${PORT}`);
    console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
});