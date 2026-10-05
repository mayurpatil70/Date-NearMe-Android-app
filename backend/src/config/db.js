const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        require: true,
    },
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Neon PostgreSQL Connected');
        client.release();
    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };