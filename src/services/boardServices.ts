import boardRepository from "../repositories/boardRepository";
import { IBoard } from "../interfaces/board";
import CustomError from "../utils/CustomError";

const getBoard = async (id: string): Promise<IBoard> => {
    const board = await boardRepository.findBoardById(id);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);
    return board;
};

const createBoard = async (name: string, description: string, ownerID: string): Promise<IBoard> => {
    return await boardRepository.createBoard(name, description, ownerID);
};

/* const deleteUser = async (id: string) => {
    const user = await userRepository.findUserById(id);
    if (!user) handleUserNotFound("Usuário não encontrado.");
    
    return await userRepository.deleteUser(id);
}; */

export default {
    getBoard,
    createBoard,
};