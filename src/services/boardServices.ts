import boardRepository from "../repositories/boardRepository";
import { IBoard, IBoardMember } from "../interfaces/board";
import CustomError from "../utils/CustomError";
import { IUser } from "../interfaces/user";
import { IColumns } from "../interfaces/columns";
import { ICards } from "../interfaces/cards"; 
import userRepository from "../repositories/userRepository";

const getBoard = async (id: string): Promise<IBoard> => {
    const board = await boardRepository.findBoardById(id);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);
    return board;
};

const createBoard = async (name: string, ownerID: string): Promise<IBoard> => {
    return await boardRepository.createBoard(name, ownerID);
};

const deleteBoard = async (id: string, user_id: string) => {
    const board = await boardRepository.findBoardById(id);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);
    if(board.owner_id != user_id) throw new CustomError ("Você não tem permissão para excluir esse quadro!", 403)
    
    return await boardRepository.deleteBoard(id);
};

const getBoardsMyUser = async (id: string): Promise<IBoard[] | string> => {
    let board: IBoard[] | string = await boardRepository.getBoardsMyUser(id);
    if (board.length === 0) board = "Você não está em nenhum quadro."
    return board;
};

const getMembersByBoard = async (boardID: string): Promise<IUser[]> => {
    const users = await boardRepository.getMembersByBoard(boardID);
    return users;
};

const addMember = async (boardID: string, emailUser: string, userID: string) => {
    const board = await boardRepository.findBoardById(boardID);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);

    if (board.owner_id != userID) throw new CustomError ("Você não tem permissão para adicionar membros nesse quadro!", 403);

    const user = await userRepository.findUserByEmail(emailUser);
    if (!user) {
        throw new CustomError('Usuário não encontrado', 404);
    }

    const existingMember = await boardRepository.findUserInBoard(boardID, user.id);
    if (existingMember) {
        throw new CustomError('Usuário já é membro do board', 400);
    }

    const boardMember = await boardRepository.addMember(boardID, user.id);
    return { user, member: boardMember };
};

const removeMember = async (boardID: string, memberID: string, userID: string): Promise<IBoardMember> => {
    const board = await boardRepository.findBoardById(boardID);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);

    const userExists = await userRepository.findUserById(memberID);
    if (!userExists) throw new CustomError ("Usuário não encontrado.", 404);

    const userExistsInBoard = await boardRepository.findUserInBoard(boardID, memberID);
    if (!userExistsInBoard) throw new CustomError ("O usuário não faz parte desse quadro.", 409);
    
    if (board.owner_id != userID && memberID != userID) throw new CustomError ("Você não tem permissão para remover membros nesse quadro!", 403);

    if(userExistsInBoard.user_id === board.owner_id) throw new CustomError("Você é o dono deste quadro, então não pode excluir a ti mesmo!", 403);

    return await boardRepository.removeMember(boardID, memberID);
};

const getColumnsAndCardsByBoard = async (boardID:string):Promise<IBoard & { columns: (IColumns & { cards: ICards[] })[] }>=>{
    const board = await boardRepository.getColumnsAndCardsByBoard(boardID);
    if (!board) throw new CustomError("Board não encontrado!", 404);
    return board;
}
export default {
    getBoard,
    createBoard,
    deleteBoard,
    getBoardsMyUser,
    getMembersByBoard,
    addMember,
    removeMember,
    getColumnsAndCardsByBoard,
};