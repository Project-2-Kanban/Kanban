import { Request, Response, NextFunction } from "express";
import {ICards, ICardsMember, ICardsResponse} from "../interfaces/cards";
import cardsServices from "../services/cardsServices";
import CustomError from "../utils/CustomError";
import { validateTitle } from "../utils/validation";
import { IUser } from "../interfaces/user";

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
        const { title, description, color, column_id } = req.body;

        if(!validateTitle(title).isValid) {
            throw new CustomError ("O titulo do card não pode ser vazio.", 400);
        }

        const userID = req.userID;

        const titleTrimmed = title.trim();
        const descriptionTrimmed = description.trim();
        

        const newCard = await cardsServices.createCard(titleTrimmed, descriptionTrimmed,color, column_id, userID);
        const response: ICardsResponse<ICards> = { data: newCard, error: null };
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
        const response: ICardsResponse<Partial<ICards>> = { data: card, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getCardsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.userID;
        const card = await cardsServices.getCardsByUser(userID);
        const response: ICardsResponse<ICards[] | string> = { data: card, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getMembersByCard = async (req: Request, res: Response): Promise<void> => {
    console.log("Parâmetros recebidos:", req.params);
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

        const newMember = await cardsServices.addMemberCard(cardID, emailUser);
        const response: ICardsResponse<ICardsMember> = { data: newMember, error: null };
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
        const userID = req.userID;
        const removedMember = await cardsServices.removeMemberCard(card_id, member_id, userID);
        const response: ICardsResponse<ICardsMember> = { data: removedMember, error: null };
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
    getCardsByUser,
    getMembersByCard,
    addMemberCard,
    removeMemberCard,
};