const { Pool } = require('pg');
require('dotenv').config();

function createDatabaseConnection() {
    return new Pool({
        user: process.env.DATABASE_USERNAME,
        host: process.env.DATABSE_HOST,
        database: process.env.DATABSE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABSE_PORT,
    });
}

module.exports = createDatabaseConnection;