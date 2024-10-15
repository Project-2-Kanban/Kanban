import { Request, Response, NextFunction } from "express";
import { IColumns, IColumnsResponse} from "../interfaces/columns";
import columnsServices from "../services/columnsServices";
import CustomError from "../utils/CustomError";
import { validateTitle } from "../utils/validation";


const getColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const columnID = req.params.id;
        const column = await columnsServices.getColumn(columnID);
        const response: IColumnsResponse<IColumns> = { data: column, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const createColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, position } = req.body;

        if(!validateTitle(title).isValid) {
            throw new CustomError ("O nome da coluna não pode ser vazio.", 400);
        }

        const boardID = req.params.board_id;

        const titleTrimmed = title.trim();

        const newColumn = await columnsServices.createColumn(titleTrimmed, position, boardID);
        const response: IColumnsResponse<IColumns> = { data: newColumn, error: null };
        res.status(201).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const deleteColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.column_id;
        const boardID = req.params.board_id;
        const column = await columnsServices.deleteColumn(id, boardID);
        const response: IColumnsResponse<Partial<IColumns>> = { data: column, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};


export default {
    getColumn,
    createColumn,
    deleteColumn,
};
