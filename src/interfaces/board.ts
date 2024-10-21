export interface IBoard {
    id: string;
    name: string;
    owner_id: string;
}

export interface IBoardMember {
    board_id: string;
    user_id: string;
    joined_at: string;
}

export interface IBoardResponse<T> {
    data: T | null;
    error: null | string;
}