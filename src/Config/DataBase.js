import 'dotenv/config';
import knex from 'knex';

// Knex configuration for PostgreSQL
const knexConfig = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    },
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200
    },
    // migrations: {
    //     directory: './src/migrations'
    // },
    // seeds: {
    //     directory: './src/seeds'
    // }
};

// Create Knex instance
const db = knex(knexConfig);

const dbConnection = async () => {
    try {
        // Check for required environment variables
        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Test the database connection
        await db.raw('SELECT 1');
        console.log('✅ Database connected successfully');
        
        return db;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

// Graceful shutdown
const closeConnection = async () => {
    try {
        await db.destroy();
        console.log('✅ Database connection closed gracefully');
    } catch (error) {
        console.error('❌ Error closing database connection:', error.message);
    }
};

export { db, dbConnection, closeConnection };
