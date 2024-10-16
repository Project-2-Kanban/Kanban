import columnsRepository from "../repositories/columnsRepository";
import { IColumns} from "../interfaces/columns";
import CustomError from "../utils/CustomError";


const getColumn = async (id: string): Promise<IColumns> => {
    const column = await columnsRepository.findColumnById(id);
    if (!column) throw new CustomError ("Coluna não encontrada!", 404);
    return column;
};

const getAllColumnsByBoardId = async (board_id: string): Promise<IColumns[]> => {
    const columns = await columnsRepository.findAllColumnsByBoardId(board_id);
    if (!columns || columns.length === 0) {
        throw new CustomError("Nenhuma coluna encontrada!", 404);
    }
    return columns;
};

const createColumn = async (title: string, position: number, board_id: string): Promise<IColumns> => {
    return await columnsRepository.createColumn(title, position, board_id);
};

const deleteColumn = async (id: string) => {
    const column = await columnsRepository.findColumnById(id);
    if (!column) throw new CustomError ("Coluna não encontrada!", 404);
    
    return await columnsRepository.deleteColumn(id);
};


export default {
    getColumn,
    getAllColumnsByBoardId,
    createColumn,
    deleteColumn,
};