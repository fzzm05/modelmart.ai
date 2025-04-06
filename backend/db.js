import pg from "pg";
import env from "dotenv";

env.config();

// Log connection details (without password)
console.log('🔌 Attempting to connect to database:', {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
});

// Create a connection pool
export const pool = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: { rejectUnauthorized: false }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle pool client:', err.message);
});

// Test the connection and check database info
pool.query('SELECT 1', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err);
    } else {
        console.log('✅ Successfully connected to database');
    }
});

export default pool;
