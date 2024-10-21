export interface IColumns {
    id: string;
    title: string;
    position: number;
    board_id: string;
}

export interface IColumnsResponse<T> {
    data: T | null;
    error: null | string;
}