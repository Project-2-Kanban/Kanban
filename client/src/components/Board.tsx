import React from 'react'
import Button from './Button/Button'
import Input from './Input/Input';
import List from './List';

interface Card {
    title: string;
    description: string;
}

interface List {
    id: string;
    title: string;
    cards: Card[]; 
}

interface BoardProps {
    data: {
        id: number;
        title: string;
        lists: List[];
    };
}

const Board: React.FC<BoardProps> = ({ data }) => {
    const handleAddList = () => {
        //+adicionar ao banco a lista
    };
    const handleCancelAddList = () => {
        //+troca a visibilidade e limpa o imput
    };
    const handleOpenCreatList = () => {
        //+abre o input para pegar o nome da lista
    }

    return (
        <div>
            <div style={{padding:'20px'}}>{data.title}</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row', gap:'10px'}}>
                    {data.lists.map((list) => (
                        <List key={list.id} id={list.id} title={list.title} cards={list.cards} /> 
                    ))}
                </div>
                <div style={{position: 'absolute',right: '20px',}}>
                    <Button text='+ Adicionar outra lista' onClick={handleOpenCreatList} />
                    <div>
                        <Input placeholder='Digite o nome da lista...' />
                        <Button text='Adicionar lista' onClick={handleAddList} />
                        <Button text='Cancelar' onClick={handleCancelAddList} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Board