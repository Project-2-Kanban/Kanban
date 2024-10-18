import boardRepository from "../repositories/boardRepository";
import { IBoard, IBoardMember } from "../interfaces/board";
import CustomError from "../utils/CustomError";
import { IUser } from "../interfaces/user";
import userRepository from "../repositories/userRepository";

const getBoard = async (id: string): Promise<IBoard> => {
    const board = await boardRepository.findBoardById(id);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);
    return board;
};

const createBoard = async (name: string, description: string, ownerID: string): Promise<IBoard> => {
    return await boardRepository.createBoard(name, description, ownerID);
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

const addMember = async (boardID: string, emailMember: string, userID: string): Promise<{ user: IUser, member: IBoardMember }> => {
    const board = await boardRepository.findBoardById(boardID);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);
    if (board.owner_id != userID) throw new CustomError ("Você não tem permissão para adicionar membros nesse quadro!", 403);

    const userExists = await userRepository.findUserByEmail(emailMember);
    if (!userExists) throw new CustomError ("Usuário não encontrado.", 404);
    const memberID = userExists.id;


    const userExistsInBoard = await boardRepository.findUserInBoard(boardID, memberID);
    if (userExistsInBoard) throw new CustomError ("O usuário já faz parte desse quadro.", 409)

    return await boardRepository.addMember(boardID, memberID);
};

const removeMember = async (boardID: string, memberID: string, userID: string): Promise<IBoardMember> => {
    const board = await boardRepository.findBoardById(boardID);
    if (!board) throw new CustomError ("Quadro não encontrado!", 404);
    if (board.owner_id != userID) throw new CustomError ("Você não tem permissão para remover membros nesse quadro!", 403);

    const userExists = await userRepository.findUserById(memberID);
    if (!userExists) throw new CustomError ("Usuário não encontrado.", 404);

    const userExistsInBoard = await boardRepository.findUserInBoard(boardID, memberID);
    if (!userExistsInBoard) throw new CustomError ("O usuário não faz parte desse quadro.", 409);
    if(userExistsInBoard.user_id === board.owner_id) throw new CustomError("Você não pode excluir você mesmo deste quadro!", 403);

    return await boardRepository.removeMember(boardID, memberID);
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