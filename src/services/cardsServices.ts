import cardsRepository from "../repositories/cardsRepository";
import { ICards, ICardsMember } from "../interfaces/cards";
import CustomError from "../utils/CustomError";
import { IUser } from "../interfaces/user";
import userRepository from "../repositories/userRepository";

const getCard = async (id: string): Promise<ICards> => {
    const cards = await cardsRepository.findCardById(id);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);
    return cards;
};

const createCard = async (title: string, description: string, color: string, column_id:string, user_id:string): Promise<ICards> => {
    return await cardsRepository.createCard(title, description, color, column_id, user_id);
};

const deleteCard = async (id: string) => {
    const cards = await cardsRepository.findCardById(id);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);
    
    return await cardsRepository.deleteCard(id);
};

const getCardsByUser = async (id: string): Promise<ICards[] | string> => {
    let cards: ICards[] | string = await cardsRepository.getCardsByUser(id);
    if (cards.length === 0) cards = "Você não está em nenhum card."
    return cards;
};

const getMembersByCard = async (cardID: string): Promise<IUser[]> => {
    const users = await cardsRepository.getMembersByCard(cardID);
    return users;
};

const addMemberCard = async (cardID: string, emailMember: string): Promise<ICardsMember> => {
    const cards = await cardsRepository.findCardById(cardID);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);

    const userExists = await userRepository.findUserByEmail(emailMember);
    if (!userExists) throw new CustomError ("Usuário não encontrado.", 404);
    const memberID = userExists.id;


    const userExistsInCard = await cardsRepository.findUserInCard(cardID, memberID);
    if (userExistsInCard) throw new CustomError ("O usuário já faz parte desse card.", 409)

    return await cardsRepository.addMemberCard(cardID, memberID);
};

const removeMemberCard = async (cardID: string, memberID: string, userID: string): Promise<ICardsMember> => {
    const cards = await cardsRepository.findCardById(cardID);
    if (!cards) throw new CustomError ("Card não encontrado!", 404);

    const userExists = await userRepository.findUserById(memberID);
    if (!userExists) throw new CustomError ("Usuário não encontrado.", 404);

    const userExistsInCard = await cardsRepository.findUserInCard(cardID, memberID);
    if (!userExistsInCard) throw new CustomError ("O usuário não faz parte desse card.", 409);

    return await cardsRepository.removeMemberCard(cardID, memberID);
};

export default {
    getCard,
    createCard,
    deleteCard,
    getCardsByUser,
    getMembersByCard,
    addMemberCard,
    removeMemberCard,
};