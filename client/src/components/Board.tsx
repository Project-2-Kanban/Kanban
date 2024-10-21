import React, { useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import List from './List';
import ChatBot from './ChatBot';
import ErrorMessage from './ErrorMessage';

interface Card {
    id?: string;
    title: string;
    description: string;
    column_id: string;
    priority?: string;
}

interface List {
    id: string;
    title: string;
    cards?: Card[];
}

interface BoardProps {
    data: {
        id: string;
        title: string;
        lists: List[];
        owner_id?: string;
    };
    setData: React.Dispatch<React.SetStateAction<{
        id: string;
        title: string;
        lists: List[];
        owner_id?:string;
    }>>;
    openMembers?:()=>void
}

const Board: React.FC<BoardProps> = ({ data, setData, openMembers }) => {
    const [isAddListOpen, setIsAddListOpen] = useState(false);
    const [isMenuAddListOpen, setIsMenuAddListOpen] = useState(true);
    const [name, setName] = useState("");
    const [message, setMesage] = useState("");
    const [visibleError, setVisibleError] = useState("");

    const url = process.env.REACT_APP_API_URL;

    const handleInputListName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleAddList = async () => {       
        const dataList = { title: name };
        if (name === "") {
            setMesage("O nome não pode estar vazio.");
            setVisibleError("addListError");
            return
        }
        addList(dataList, data.id)
        setName("");
        setIsAddListOpen(false);
        setIsMenuAddListOpen(true);
    };

    const handleCancelAddList = () => {
        setName("");
        setMesage("");
        setVisibleError("addListError");
        setIsAddListOpen(false);
        setIsMenuAddListOpen(true);
    };

    const handleOpenCreateList = () => {
        setName("");
        setIsAddListOpen(true);
        setIsMenuAddListOpen(false);
    };

    const getAllLists = async () => {
        try {
            const response = await fetch(`${url}/column/get/all/${data.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                console.log('Erro ao pegar listas');
                return;
            }

            const allLists = await response.json();
            return allLists.data;
        } catch (error) {
            console.error('Erro ao pegar listas:', error);
        }
    }

    const addList = async (data: { title: string }, boardId: string) => {
        try {
            const response = await fetch(`${url}/column/create/${boardId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                setMesage("Erro ao adicionar lista.");
                setVisibleError("addListError");
                return;
            }
            const createdList = await response.json();

            setData((prevData) => ({
                ...prevData,
                lists: [...prevData.lists, { ...createdList.data, cards: [] }]
            }));

        } catch (error) {
            console.error('Erro ao adicionar lista:', error);
        }

    }

    return (
        <div>
            <div style={{ padding: '20px' }}>{data.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', height: 'calc(-190px + 100vh)' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        {data.lists.length > 0 ? (
                            data.lists.map((list) => (
                                <List key={list.id} id={list.id} title={list.title} cards={list.cards || []} boardId={data.id} />
                            ))
                        ) : (
                            <div>Nenhuma lista encontrada.</div>
                        )}
                    </div>
                    <div>
                        <div style={{ width: '290px' }}>
                            {isMenuAddListOpen && (
                                <Button text='+ Adicionar outra lista' onClick={handleOpenCreateList} style={{ width: '100%' }} />
                            )}
                            {isAddListOpen && (
                                <div style={{ backgroundColor: '#979fa5', padding: '10px', borderRadius: '10px' }}>
                                    <Input placeholder='Digite o nome da lista...' onChange={handleInputListName} value={name} />
                                    <ErrorMessage text={message} style={{ visibility: visibleError === "addListError" ? 'visible' : 'hidden' }} />

                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button text='Adicionar lista' onClick={handleAddList} style={{ width: '49%' }} />
                                        <Button text='Cancelar' onClick={handleCancelAddList} style={{ width: '49%' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Button text="Ver Membros" onClick={openMembers} style={{ position:'fixed', top:'10%', right: '5%'}} />
            <ChatBot id={data.id}/>

        </div>
    );
};

export default Board;
