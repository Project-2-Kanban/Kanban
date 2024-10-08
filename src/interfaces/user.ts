export interface IUser {
    id: number;
    email: string;
    name: string;
    password: string;
}

export interface IUserResponse<T> {
    data: T | null;
    error: null | string;
}
