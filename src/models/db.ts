import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool ({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST || 'postgres',
    database:process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT) || 5432,
});

pool.on('connect', ()=>{
    console.log('Conected to PostgreSQL');
});

export { pool };