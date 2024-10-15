import { Request, Response, NextFunction } from "express";
import {IUser, IUserResponse} from "../interfaces/user";
import userServices from "../services/userServices";
import { validateEmail, validateName, validatePassword } from "../utils/validation";
import CustomError from "../utils/CustomError";

// Função para validação de dados do usuário
const validateUserInput = (name: string, email: string, password: string): void => {
    if (!validateName(name).isValid) {
        throw new CustomError ("O nome deve conter apenas letras e ter no mínimo 4 caracteres.", 400);
    }
    if (!validateEmail(email).isValid) {
        throw new CustomError ("E-mail inválido.", 400);
    }
    if (!validatePassword(password).isValid) {
        throw new CustomError ("A senha deve conter pelo menos uma letra e um número, e ter no mínimo 8 caracteres.", 400);
    }
};

// Funções dos controladores
const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userServices.getUsers();
        const response: IUserResponse<IUser[]> = { data: users, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        validateUserInput(name, email, password);

        const newUser = await userServices.createUser(name, email, password);
        const response: IUserResponse<Partial<IUser>> = { data: newUser, error: null };
        res.status(201).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const authenticateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const { token, userID } = await userServices.authenticateUser(email, password);
        res.cookie('session_id', token, { httpOnly: true, expires: new Date(Date.now() + 864000000) });

        const response: IUserResponse<Partial<IUser>> = { data: { id: userID }, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const id = req.params.id;

        if (name || email || password) {
            validateUserInput(name || "", email || "", password || "");
        }

        const user = await userServices.updateUser(id, name, email, password);
        const response: IUserResponse<Partial<IUser>> = { data: user, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('session_id', { path: '/' });
        const response: IUserResponse<string> = { data: "Usuário desconectado.", error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await userServices.deleteUser(id);
        const response: IUserResponse<Partial<IUser>> = { data: user, error: null };
        res.status(200).json(response);
    } catch (e: any) {
        console.error(e);
        res.status(e.status || 500).json({ data: null, error: e.message });
    }
};

export default {
    getUsers,
    createUser,
    authenticateUser,
    updateUser,
    deleteUser,
    logoutUser
};
