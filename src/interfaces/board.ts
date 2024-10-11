export interface IBoard {
    id: number;
    name: string;
    description: string;
    owner_id: string;
}

export interface IBoardResponse<T> {
    data: T | null;
    error: null | string;
}