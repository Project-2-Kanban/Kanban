export interface ICards{
    id: string;
    title:string;
    description: string;
    color: string;
    column_id:string;
}
export interface ICardsMember{
    user_id:string;
    card_id:string;
}

export interface ICardsResponse<T>{
    data: T | null;
    error: null | string;
}