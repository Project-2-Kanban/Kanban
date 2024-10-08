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

//exporta o objeto pool diretamente, o que oferece 
//mais flexibilidade e permite o acesso a todas as funcionalidades do pool, 
//mas expõe mais detalhes da implementação.
export { pool };

// export const query = (text: string, params?: any[]) => pool.query(text, params);
// encapsula o uso do pool, expondo apenas uma função query. 
// Isso torna o código mais simples e abstrai a complexidade de como as queries são feitas.