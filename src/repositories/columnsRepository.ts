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


const createColumn = async (title: string, position: number, board_id: string): Promise<IColumns> => {
    const result = await pool.connect();
    try {
        const query = `INSERT INTO columns (title, position, board_id) VALUES ($1, $2, $3) RETURNING *`;
        const { rows } = await result.query(query, [title, position, board_id]);
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

export default {
    findColumnById,
    findAllColumnsByBoardId,
    createColumn,
    deleteColumn,
};