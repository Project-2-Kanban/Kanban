import { Request, Response, NextFunction } from "express";
import {IBoard, IBoardMember, IBoardResponse} from "../interfaces/board";
import boardServices from "../services/boardServices";
import CustomError from "../utils/CustomError";
import { validateTitle } from "../utils/validation";
import { IUser } from "../interfaces/user";

const getBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const boardID = req.params.id;
        const board = await boardServices.getBoard(boardID);
        const response: IBoardResponse<IBoard> = { data: board, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if(!validateTitle(name).isValid) {
            throw new CustomError ("O nome do board não pode ser vazio.", 400);
        }

        const userID = req.userID;

        const nameTrimmed = name.trim();
        const descriptionTrimmed = description.trim();

        const newBoard = await boardServices.createBoard(nameTrimmed, descriptionTrimmed, userID);
        const response: IBoardResponse<IBoard> = { data: newBoard, error: null };
        res.status(201).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.board_id;
        const userID = req.userID;
        const board = await boardServices.deleteBoard(id, userID);
        const response: IBoardResponse<Partial<IBoard>> = { data: board, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getBoardsMyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.userID;
        const board = await boardServices.getBoardsMyUser(userID);
        const response: IBoardResponse<IBoard[] | string> = { data: board, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const getMembersByBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const board_id = req.params.board_id;
        const members = await boardServices.getMembersByBoard(board_id);
        const response: IBoardResponse<Partial<IUser[]>> = { data: members, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const addMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const boardID = req.params.idBoard;
        const emailUser = req.body.emailUser;

        const newMember = await boardServices.addMember(boardID, emailUser);

        const response = {
            data: {
                member: {
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

const removeMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const board_id = req.params.idBoard;
        const member_id = req.params.idMember;
        const userID = req.userID;
        const removedMember = await boardServices.removeMember(board_id, member_id, userID);
        const response: IBoardResponse<IBoardMember> = { data: removedMember, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

export default {
    getBoard,
    createBoard,
    deleteBoard,
    getBoardsMyUser,
    getMembersByBoard,
    addMember,
    removeMember,
};
