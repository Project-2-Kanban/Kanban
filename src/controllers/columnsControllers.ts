import { Request, Response } from "express";
import { IColumns, IColumnsResponse } from "../interfaces/columns";
import columnsServices from "../services/columnsServices";
import CustomError from "../utils/CustomError";
import { validateTitle } from "../utils/validation";
import { broadcastToRoom } from "../websocket/websocket";

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

const getAllColumns = async (req: Request, res: Response): Promise<void> => {
    try {
        const boardID = req.params.board_id;
        const columns = await columnsServices.getAllColumnsByBoardId(boardID);
        const response: IColumnsResponse<IColumns[]> = { data: columns, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const createColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.body;

        if (!validateTitle(title).isValid) {
            throw new CustomError("O nome da coluna não pode ser vazio.", 400);
        }

        const boardID = req.params.board_id;
        const titleTrimmed = title.trim();

        const newColumn = await columnsServices.createColumn(titleTrimmed, boardID);

        broadcastToRoom(boardID, { action: "create_column", data: JSON.stringify(newColumn) });

        res.status(201).json({
            data: newColumn,
            error: null
        });
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const deleteColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const columnID = req.params.column_id;
        const deletedColumn = await columnsServices.deleteColumn(columnID);

        broadcastToRoom(deletedColumn.board_id, { action: "delete_column", data: columnID });

        res.status(200).json({
            data: deletedColumn,
            error: null
        });
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const updateColumn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.body;
        const columnID = req.params.id;

        const updatedColumn = await columnsServices.updateColumn(columnID, title);

        broadcastToRoom(updatedColumn.board_id, { action: "update_column", data: JSON.stringify(updatedColumn) });

        res.status(200).json({
            message: "Coluna atualizada com sucesso",
            data: updatedColumn
        });
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

export default {
    getColumn,
    getAllColumns,
    createColumn,
    deleteColumn,
    updateColumn,
};