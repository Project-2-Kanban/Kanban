import { pool } from '../models/db';
import { IBoard, IBoardMember } from '../interfaces/board'
import { IColumns } from '../interfaces/columns';
import { ICards } from '../interfaces/cards';
import { IUser } from '../interfaces/user';
import CustomError from '../utils/CustomError';

async function findBoardById(id: string) {
    const query = 'SELECT * FROM boards WHERE id = $1';
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

const createBoard = async (name: string, owner_id: string): Promise<IBoard> => {
    const result = await pool.connect();
    try {
        await result.query('BEGIN');
        const query = `INSERT INTO boards (name, owner_id) VALUES ($1, $2) RETURNING *`;
        const { rows } = await result.query(query, [name, owner_id]);
        const query2 = `INSERT INTO board_members (board_id, user_id) VALUES ($1, $2)`
        await result.query(query2, [rows[0].id, owner_id]);
        await result.query('COMMIT');
        return rows[0];
    } catch (e: any) {
        await result.query('ROLLBACK');
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const deleteBoard = async (id: string): Promise<IBoard> => {
    const query = 'DELETE FROM boards WHERE id = $1 RETURNING *';
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

const getBoardsMyUser = async (userId: string): Promise<IBoard[]> => {
    const query = `
        SELECT b.*
        FROM boards b
        INNER JOIN board_members bm ON b.id = bm.board_id
        WHERE bm.user_id = $1
    `;
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [userId]);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const getMembersByBoard = async (boardID: string): Promise<IUser[]> => {
    const query = `
        SELECT u.id, u.name, u.email
        FROM users u
        INNER JOIN board_members bm ON u.id = bm.user_id
        WHERE bm.board_id = $1
    `;
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [boardID]);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

async function findUserInBoard(boardID: string, memberID: string) {
    const query = 'SELECT * FROM board_members WHERE board_id = $1 AND user_id = $2';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [boardID, memberID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const addMember = async (boardID: string, memberID: string): Promise<{ user: IUser, member: IBoardMember }> => {
    let result;
    try {
        result = await pool.connect();

        const existingMemberQuery = 'SELECT * FROM board_members WHERE board_id = $1 AND user_id = $2';
        const existingMemberResult = await result.query(existingMemberQuery, [boardID, memberID]);

        if (existingMemberResult.rows.length > 0) {
            throw new CustomError('Membro já adicionado ao board.', 400);
        }

        await result.query('BEGIN');

        const addMemberQuery = `INSERT INTO board_members (board_id, user_id) VALUES ($1, $2) RETURNING *`;
        const memberResult = await result.query(addMemberQuery, [boardID, memberID]);

        const getUserQuery = 'SELECT id, name, email FROM users WHERE id = $1';
        const userResult = await result.query(getUserQuery, [memberID]);

        await result.query('COMMIT');

        return {
            user: userResult.rows[0],
            member: memberResult.rows[0]
        };
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const removeMember = async (boardID: string, memberID: string): Promise<IBoardMember> => {
    const query = 'DELETE FROM board_members WHERE board_id = $1 AND user_id = $2 RETURNING *';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [boardID, memberID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};
const getColumnsAndCardsByBoard = async (boardID: string): Promise<IBoard & { columns: (IColumns & { cards: ICards[] })[] }> => {
    const query = `
        SELECT 
            b.id as board_id, b.name as board_name, b.owner_id,
            c.id as column_id, c.title as column_title, c.created_at as column_created_at,
            cr.id as card_id, cr.title as card_title, cr.description as card_description, cr.priority as card_priority
        FROM boards b
        LEFT JOIN columns c ON b.id = c.board_id
        LEFT JOIN cards cr ON c.id = cr.column_id
        WHERE b.id = $1
        ORDER BY c.created_at ASC, cr.created_at ASC
    `;
    
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [boardID]);
        if (rows.length === 0 || !rows[0].board_id) {
            throw new CustomError('Board não encontrado', 404);
        }

        const board: IBoard & { columns: (IColumns & { cards: ICards[] })[] } = {
            id: rows[0].board_id,
            name: rows[0].board_name,
            owner_id: rows[0].owner_id,
            columns: []
        };

        const columns: { [key: string]: IColumns & { cards: ICards[] } } = {};

        rows.forEach((row) => {
            if (row.column_id) {
                if (!columns[row.column_id]) {
                    columns[row.column_id] = {
                        id: row.column_id,
                        title: row.column_title,
                        board_id: board.id,
                        cards: []
                    };
                }

                if (row.card_id) {
                    columns[row.column_id].cards.push({
                        id: row.card_id,
                        title: row.card_title,
                        description: row.card_description,
                        priority: row.card_priority,
                        column_id: row.column_id
                    });
                }
            }
        });

        board.columns = Object.values(columns);

        return board;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};


export default {
    findBoardById,
    createBoard,
    deleteBoard,
    getBoardsMyUser,
    getMembersByBoard,
    findUserInBoard,
    addMember,
    removeMember,
    getColumnsAndCardsByBoard,
};