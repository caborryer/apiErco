const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5434,
});

pool.connect()
    .then(() => console.log('Conexión exitosa a PostgreSQL'))
    .catch((err) => console.error('Error conectándose a PostgreSQL:', err.stack));

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};