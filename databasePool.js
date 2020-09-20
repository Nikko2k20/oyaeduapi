const cors = require('cors');
const knex = require('knex');

const pool = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});


module.exports = pool;