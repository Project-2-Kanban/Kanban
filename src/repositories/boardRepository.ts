import {pool} from '../models/db';
import { IBoard } from '../interfaces/board'
import CustomError from '../utils/CustomError';

/* const getUsers = async (): Promise<IBoard[]> => {
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
}; */

async function findBoardById (id: string){
    const query = 'SELECT * FROM boards WHERE id = $1';
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

const createBoard = async (name: string, description: string, owner_id: string): Promise<IBoard> => {
    const result = await pool.connect();
    try {
        await result.query('BEGIN');
        const query = `INSERT INTO boards (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *`;
        const { rows } = await result.query(query, [name, description, owner_id]);
        const query2 = `INSERT INTO board_members (board_id, user_id) VALUES ($1, $2)`
        await result.query(query2, [rows[0].id, owner_id]);
        await result.query('COMMIT');
        return rows[0];
    } catch (e: any) {
        await result.query('ROLLBACK');
        throw new CustomError (e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const deleteBoard = async (id: string): Promise<IBoard> => {
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
    findBoardById,
    createBoard,
    deleteBoard
};