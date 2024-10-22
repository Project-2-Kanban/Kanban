import { pool } from '../models/db'
import { IColumns} from '../interfaces/columns'
import CustomError from '../utils/CustomError';

async function findColumnById(id: string) {
    const query = 'SELECT * FROM columns WHERE id = $1';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};
const findAllColumnsByBoardId = async (board_id: string): Promise<IColumns[]> => {
    const query = 'SELECT * FROM columns WHERE board_id = $1 ORDER BY position';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [board_id]);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};


const createColumn = async (title: string, board_id: string): Promise<IColumns> => {
    const result = await pool.connect();
    try {
        const query = `INSERT INTO columns (title, board_id) VALUES ($1, $2) RETURNING *`;
        const { rows } = await result.query(query, [title, board_id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const deleteColumn = async (id: string): Promise<IColumns> => {
    const query = 'DELETE FROM columns WHERE id = $1 RETURNING *';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [id]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};
const updateColumn = async (id: string, title: string):Promise<IColumns> => {
    let result;
    try{
        result = await pool.connect();
        const query = `
            UPDATE columns
            SET title = $1
            WHERE id = $2
            RETURNING *;
        `;
        const { rows } = await result.query(query,[title, id]);

        if (rows.length === 0) {
            throw new CustomError('Coluna não encontrada',404);
        }
        return rows[0];
    }catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

export default {
    findColumnById,
    findAllColumnsByBoardId,
    createColumn,
    deleteColumn,
    updateColumn,
};