import { pool } from '../models/db';
import { ICards, ICardsMember } from '../interfaces/cards'
import { IUser } from '../interfaces/user';
import CustomError from '../utils/CustomError';

async function findCardById(id: string) {
    const query = 'SELECT * FROM cards WHERE id = $1';
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

const createCard = async (title: string, description: string, color: string, column_id:string): Promise<ICards> => {
    const result = await pool.connect();
    try {
        await result.query('BEGIN');
        const query = `INSERT INTO cards (title, description, color, column_id) VALUES ($1, $2, $3, $4) RETURNING *`;
        const { rows } = await result.query(query, [title, description, color, column_id]);
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

const deleteCard = async (id: string): Promise<ICards> => {
    const query = 'DELETE FROM cards WHERE id = $1 RETURNING *';
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

const getAllCardsByColumn = async(columnID:string):Promise<ICards[]>=>{
    const query= `
        SELECT id, title, description, color, created_at
        FROM cards
        WHERE column_id=$1
        ORDER BY created_at ASC;
    `;
    let result;
    try{
        result = await pool.connect();
        const { rows } = await result.query(query,[columnID]);
        return rows;
    }catch (e: any) {
        throw new CustomError(e.message, 500);
    }finally {
        if (result) {
            result.release();
        }
    }
}

const getCardsByUser = async (userId: string): Promise<ICards[]> => {
    const query = `
        SELECT b.*
        FROM cards b
        INNER JOIN card_members bm ON b.id = bm.card_id
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

const getMembersByCard = async (cardID: string): Promise<IUser[]> => {
    const query = `
        SELECT u.id, u.name, u.email
        FROM users u
        INNER JOIN card_members bm ON u.id = bm.user_id
        WHERE bm.card_id = $1
    `;
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [cardID]);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

async function findUserInCard(cardID: string, memberID: string) {
    const query = 'SELECT * FROM card_members WHERE card_id = $1 AND user_id = $2';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [cardID, memberID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const addMemberCard = async (cardID: string, memberID: string): Promise<ICardsMember> => {
    const query = `INSERT INTO card_members (card_id, user_id) VALUES ($1, $2) RETURNING *`;
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [cardID, memberID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const removeMemberCard = async (cardID: string, memberID: string): Promise<ICardsMember> => {
    const query = 'DELETE FROM card_members WHERE card_id = $1 AND user_id = $2 RETURNING *';
    let result;
    try {
        result = await pool.connect();
        const { rows } = await result.query(query, [cardID, memberID]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (result) {
            result.release();
        }
    }
};

const updateCard = async (id:string, title:string, description:string,color:string): Promise<ICards> => {
    let result;
    try {
        result = await pool.connect();
        const query = `
            UPDATE cards
            SET title = $1, description = $2, color = $3
            WHERE id = $4
            RETURNING *;
        `;
        const { rows } = await result.query(query, [title, description, color, id]);

        if (rows.length === 0) {
            throw new CustomError('Card não encontrado', 404);
        }

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
    findCardById,
    createCard,
    deleteCard,
    getAllCardsByColumn,
    getCardsByUser,
    getMembersByCard,
    findUserInCard,
    addMemberCard,
    removeMemberCard,
    updateCard,
};