import { Request, Response, NextFunction } from "express";
import {IBoard, IBoardResponse} from "../interfaces/board";
import boardServices from "../services/boardServices";
import CustomError from "../utils/CustomError";
import { validateTitle } from "../utils/validation";

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

/*const getBoardsMyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.userID;
        const board = await boardServices.getBoardsMyUser(userID);
        const response: IBoardResponse<IBoard[]> = { data: board, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};*/

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
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

/*const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await userServices.deleteUser(id);
        const response: IUserResponse<Partial<IUser>> = { data: user, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};*/

export default {
    getBoard,
    //getBoardsMyUser,
    createBoard,
    //deleteUser,
};
