import cardsRepository from "../repositories/cardsRepository";
import { ICards, ICardsMember } from "../interfaces/cards";
import CustomError from "../utils/CustomError";
import { IUser } from "../interfaces/user";
import userRepository from "../repositories/userRepository";
import boardRepository from "../repositories/boardRepository";

const getCard = async (id: string): Promise<ICards> => {
    const cards = await cardsRepository.findCardById(id);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);
    return cards;
};

const createCard = async (title: string, description: string, priority: string, column_id:string): Promise<ICards> => {
    return await cardsRepository.createCard(title, description, priority, column_id);
};

const deleteCard = async (id: string) => {
    const cards = await cardsRepository.findCardById(id);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);
    
    return await cardsRepository.deleteCard(id);
};

const getCardsByUser = async (id: string): Promise<ICards[] | string> => {
    let cards: ICards[] | string = await cardsRepository.getCardsByUser(id);
    if (cards.length === 0) cards = "O usuário não está em nenhum card."
    return cards;
};
const getAllCardsByColumn = async(columnsID:string):Promise<ICards[]>=>{
    const cards = await cardsRepository.getAllCardsByColumn(columnsID);
    if(cards.length===0) throw new CustomError ("Nenhum card encontrado para esta coluna!", 404);
    return cards;
}

const getMembersByCard = async (cardID: string): Promise<IUser[]> => {
    const users = await cardsRepository.getMembersByCard(cardID);
    return users;
};

const addMemberCard = async (cardID: string, emailMember: string, board_id:string) => {
    const card = await cardsRepository.findCardById(cardID);
    if (!card) throw new CustomError("Card não encontrado!", 404);

    const user = await userRepository.findUserByEmail(emailMember);
    if (!user) throw new CustomError("Usuário não encontrado.", 404);

    const userExistsInBoard = await boardRepository.findUserInBoard(board_id,user.id);
    if (!userExistsInBoard) throw new CustomError("Usuário não pertence ao board.", 404);

    const userExistsInCard = await cardsRepository.findUserInCard(cardID, user.id);
    if (userExistsInCard) throw new CustomError("O usuário já faz parte desse card.", 409);

    const cardMember = await cardsRepository.addMemberCard(cardID, user.id);
    
    return { user, member: cardMember };
};

const removeMemberCard = async (cardID: string, memberID: string): Promise<ICardsMember> => {
    const cards = await cardsRepository.findCardById(cardID);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);

    const userExists = await userRepository.findUserById(memberID);
    if (!userExists) throw new CustomError ("Usuário não encontrado.", 404);

    const userExistsInCard = await cardsRepository.findUserInCard(cardID, memberID);
    if (!userExistsInCard) throw new CustomError ("O usuário não faz parte desse card.", 409);

    return await cardsRepository.removeMemberCard(cardID, memberID);
};

const updateCard = async (id: string, title: string, description: string, priority: string, column_id: string): Promise<ICards> => {
    const card = await cardsRepository.findCardById(id);
    if (!card) throw new CustomError("Card não encontrado!", 404);

    if (title.trim() === "") {
        throw new CustomError("O título do card não pode ser vazio.", 400);
    }

    return await cardsRepository.updateCard(id, title.trim(), description, priority, column_id);
}

export default {
    getCard,
    createCard,
    deleteCard,
    getAllCardsByColumn,
    getCardsByUser,
    getMembersByCard,
    addMemberCard,
    removeMemberCard,
    updateCard,
};