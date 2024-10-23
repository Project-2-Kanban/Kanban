import userRepository from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import hashPassword from "../utils/hashPassword";
import comparePassword from "../utils/comparePassword";
import CustomError from "../utils/CustomError";
import jwt from "jsonwebtoken";
const TOKEN_EXPIRATION_TIME = 864000;

const SECRET_KEY = process.env.JWT_SECRET || "chave_padrao";

const handleUserNotFound = (message: string) => {
    throw new CustomError ( message, 404 );
};

const getUsers = async (): Promise<IUser[]> => {
    return await userRepository.getUsers();
};

const getUser = async (id: string): Promise<IUser> => {
    const user = await userRepository.findUserById(id);
    if (!user) handleUserNotFound("Usuário não encontrado.");
    return user;
};

const createUser = async (name: string, email: string, password: string): Promise<Partial<IUser>> => {
    const userExists = await userRepository.findUserByEmail(email);
    if (userExists) {
        throw new CustomError ("O e-mail fornecido já está sendo utilizado", 400);
    }
    const hashedPassword = await hashPassword(password);
    return await userRepository.createUser(name, email, hashedPassword);
};

const authenticateUser = async (email: string, password: string) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
        throw new CustomError ("E-mail e/ou senha inválidos", 400);
    }
    const token = jwt.sign({ userID: user.id, email: user.email, name:user.name }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION_TIME });
    return { token, userID: user.id, userName: user.name };
};

const updateUser = async (id: string, name?: string, email?: string, password?: string) => {
    const oldUser = await userRepository.findUserById(id);
    if (!oldUser) handleUserNotFound("Usuário não existe.");

    const hashedPassword = password ? await hashPassword(password) : oldUser.password;
    return await userRepository.updateUser(
        id,
        name || oldUser.name,
        email || oldUser.email,
        hashedPassword
    );
};

const deleteUser = async (id: string) => {
    const user = await userRepository.findUserById(id);
    if (!user) handleUserNotFound("Usuário não encontrado.");
    
    return await userRepository.deleteUser(id);
};

export default {
    getUsers,
    getUser,
    createUser,
    authenticateUser,
    updateUser,
    deleteUser,
};
