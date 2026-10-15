require("dotenv").config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL || process.env.NEON_DATABASE_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Neon PostgreSQL Connected');
        client.release();
    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

module.exports = { pool, connectDB };