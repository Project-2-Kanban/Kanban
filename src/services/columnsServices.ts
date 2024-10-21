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

const createColumn = async (title: string, board_id: string): Promise<IColumns> => {
    return await columnsRepository.createColumn(title, board_id);
};

const deleteColumn = async (id: string) => {
    const column = await columnsRepository.findColumnById(id);
    if (!column) throw new CustomError ("Coluna não encontrada!", 404);
    
    return await columnsRepository.deleteColumn(id);
};
const updateColumn = async (id:string, title:string, position:number):Promise<IColumns> => {
    const column = await columnsRepository.findColumnById(id);
    if (!column) throw new CustomError("Coluna não encontrada!", 404);

    if (!title) {
        throw new CustomError("O nome da coluna não pode ser vazio.", 400);
    }

    return await columnsRepository.updateColumn(id, title.trim(), position);
}


export default {
    getColumn,
    getAllColumnsByBoardId,
    createColumn,
    deleteColumn,
    updateColumn,
};