import {pool} from '../models/db';
import { IUser } from '../interfaces/user'
import CustomError from '../utils/CustomError';

interface userTypes{
    id:string;
    email:string;
    name:string;
    password:string;
}

const getUsers = async (): Promise<IUser[]> => {
    const query = 'SELECT id, name FROM users';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query);
        return rows;
    } catch (e: any) {
        throw new CustomError (e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

async function findUserByEmail (email:userTypes['email']):Promise<IUser> {
    const query = 'SELECT * FROM users WHERE email = $1';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query,[email]);
        return rows[0];
    } catch (error) {
        console.log('Falha ao pegar os dados dos usuários', error);
        throw error;
    }finally {
        if (result) {
            result.release();
        }
    }
}

async function findUserById (id:userTypes['id']){
    console.log('id do user:', id)
    const query = 'SELECT email, name FROM users WHERE email = $1';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError (e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const createUser = async (name: userTypes['name'], email: userTypes['email'], password: userTypes['password']): Promise<Partial<IUser>> => {
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [name, email, password]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError (e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const updateUser = async (id: userTypes['id'], name: userTypes['name'], email: userTypes['email'], password: userTypes['password']): Promise<Partial<IUser>> => {
    const query = 'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [name, email, password, id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError (e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const deleteUser = async (id: userTypes['id']): Promise<Partial<IUser>> => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError (e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

export default {
    getUsers,
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    deleteUser
};