import React, { useState } from 'react'
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
    const [isAddListOpen, setIsAddListOpen] = useState(false);
    const [isMenuAddListOpen, setIsMenuAddListOpen] = useState(true);
    const [name, setName] = useState("");

    const handleInputListName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleAddList = () => {
        //+adicionar ao banco a lista， fetch
        setName("");
        setIsAddListOpen(false);
        setIsMenuAddListOpen(true)
    };

    const handleCancelAddList = () => {
        setName("");
        setIsAddListOpen(false);
        setIsMenuAddListOpen(true)
    };

    const handleOpenCreatList = () => {
        setName("");
        setIsAddListOpen(true);
        setIsMenuAddListOpen(false)
    }

    return (
        <div>
            <div style={{ padding: '20px' }}>{data.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', height: 'calc(-190px + 100vh)' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        {data.lists.map((list) => (
                            <List key={list.id} id={list.id} title={list.title} cards={list.cards} />
                        ))}
                    </div>
                    <div>
                        <div style={{ width: '290px' }}>
                            {isMenuAddListOpen && (
                                <Button text='+ Adicionar outra lista' onClick={handleOpenCreatList} style={{ width: '100%' }} />

                            )}
                            {isAddListOpen && (
                                <div style={{ backgroundColor: '#979fa5', padding: '10px', borderRadius: '10px' }}>
                                    <Input placeholder='Digite o nome da lista...' onChange={handleInputListName} value={name} />
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <Button text='Adicionar lista' onClick={handleAddList} style={{ width: '130px' }} />
                                        <Button text='Cancelar' onClick={handleCancelAddList} style={{ width: '130px' }} />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Board