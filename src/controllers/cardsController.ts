import { Request, Response } from "express";
import { ICards, ICardsMember, ICardsResponse } from "../interfaces/cards";
import cardsServices from "../services/cardsServices";
import CustomError from "../utils/CustomError";
import { validateTitle } from "../utils/validation";
import { IUser } from "../interfaces/user";
import { broadcastToRoom } from "../websocket/websocket";

const getCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const cardID = req.params.id;
        const card = await cardsServices.getCard(cardID);
        const response: ICardsResponse<ICards> = { data: card, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const createCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, priority, column_id, board_id } = req.body;

        if (!validateTitle(title).isValid) {
            throw new CustomError("O titulo do card não pode ser vazio.", 400);
        }

        const titleTrimmed = title.trim();
        const descriptionTrimmed = description.trim();

        const newCard = await cardsServices.createCard(titleTrimmed, descriptionTrimmed, priority, column_id);

        broadcastToRoom(board_id, {
            action: "create_card",
            data: JSON.stringify(newCard)
        });

        const response: ICardsResponse<ICards> = {
            data: newCard,
            error: null
        };

        res.status(201).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const deleteCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const cardID = req.params.cards_id;
        const card = await cardsServices.deleteCard(cardID);
        const board_id = req.body.board_id;

        broadcastToRoom(board_id, {
            action: "delete_card",
            data: cardID
        });

        const response: ICardsResponse<Partial<ICards>> = {
            data: card,
            error: null
        };

        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getAllCardsByColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const columnID = req.params.column_id;
        console.log(columnID);
        const cards = await cardsServices.getAllCardsByColumn(columnID);
        const response: ICardsResponse<ICards[] | string> = { data: cards, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getCardsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.body.userID;
        const card = await cardsServices.getCardsByUser(userID);
        const response: ICardsResponse<ICards[] | string> = { data: card, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getMembersByCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const card_id = req.params.cards_id;
        console.log("Buscando membros para o card:", card_id);
        const members = await cardsServices.getMembersByCard(card_id);
        console.log("Membros encontrados:", members);
        const response: ICardsResponse<Partial<IUser[]>> = { data: members, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const addMemberCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const cardID = req.params.card_id;
        const emailUser = req.body.emailUser;
        const board_id = req.body.board_id;

        const newMember = await cardsServices.addMemberCard(cardID, emailUser);

        const filteredUser = {
            id: newMember.user.id,
            name: newMember.user.name,
            email: newMember.user.email
        };

        broadcastToRoom(board_id, {
            action: "add_member_card",
            data: JSON.stringify(filteredUser)
        });

        const response = {
            data: {
                member: {
                    user: filteredUser,
                    member: newMember.member
                }
            },
            error: null
        };

        res.status(201).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const removeMemberCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const card_id = req.params.card_id;
        const member_id = req.params.member_id;
        const board_id = req.body.board_id;
        const removedMember = await cardsServices.removeMemberCard(card_id, member_id);

        broadcastToRoom(board_id, {
            action: "remove_member_card",
            data: member_id
        });

        const response: ICardsResponse<ICardsMember> = { data: removedMember, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const updateCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, priority, board_id } = req.body;
        const cardID = req.params.id;

        const updatedCard = await cardsServices.updateCard(cardID, title, description, priority);
        broadcastToRoom(board_id, {
            action: "update_card",
            data: JSON.stringify(updatedCard)
        });

        const response: ICardsResponse<ICards> = { data: updatedCard, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

export default {
    getCard,
    createCard,
    deleteCard,
    getAllCardsByColumn,
    getCardsByUser,
    getMembersByCard,
    addMemberCard,
    removeMemberCard,
    updateCard,
};