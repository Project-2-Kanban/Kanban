import columnsRepository from "../repositories/columnsRepository";
import { IColumns} from "../interfaces/columns";
import CustomError from "../utils/CustomError";


const getColumn = async (id: string): Promise<IColumns> => {
    const column = await columnsRepository.findColumnById(id);
    if (!column) throw new CustomError ("Coluna não encontrada!", 404);
    return column;
};

const createColumn = async (title: string, position: number, board_id: string): Promise<IColumns> => {
    return await columnsRepository.createColumn(title, position, board_id);
};

const deleteColumn = async (id: string, user_id: string) => {
    const column = await columnsRepository.findColumnById(id);
    if (!column) throw new CustomError ("Coluna não encontrada!", 404);
    if(column.owner_id != user_id) throw new CustomError ("Você não tem permissão para excluir essa coluna!", 403)
    
    return await columnsRepository.deleteColumn(id);
};


export default {
    getColumn,
    createColumn,
    deleteColumn,
};