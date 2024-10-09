import userRepository from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import hashPassword from "../utils/hashPassword";
import comparePassword from "../utils/comparePassword";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY || "chave_padrao";
const TOKEN_EXPIRATION_TIME = 864000; // Tempo de expiração do token (10 dias)

const handleUserNotFound = (message: string) => {
    throw { message, status: 404 };
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
        throw { message: "O e-mail fornecido já está sendo utilizado", status: 400 };
    }
    const hashedPassword = await hashPassword(password);
    return await userRepository.createUser(name, email, hashedPassword);
};

const authenticateUser = async (email: string, password: string) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
        throw { message: "E-mail e/ou senha inválidos", status: 400 };
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION_TIME });
    return { token, userId: user.id };
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
