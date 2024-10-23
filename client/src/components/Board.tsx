import React, { useEffect, useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import List from './List';
import ChatBot from './ChatBot';
import ErrorMessage from './ErrorMessage';
import Dialog from './Dialog/Dialog';

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
    position: string;
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
        owner_id?: string;
    }>>;
    openMembers?: () => void
}

const Board: React.FC<BoardProps> = ({ data, setData, openMembers }) => {
    const [isAddListOpen, setIsAddListOpen] = useState(false);
    const [isMenuAddListOpen, setIsMenuAddListOpen] = useState(true);
    const [name, setName] = useState("");
    const [message, setMesage] = useState("");
    const [visibleError, setVisibleError] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const url = process.env.REACT_APP_API_URL;
    const urlWs = 'ws://localhost:3000/api'
    const [dataList, setDataList] = useState(data);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [titleList, setTitle] = useState(data.lists);
    console.log(data)


    useEffect(() => {
        const ws = new WebSocket(`${urlWs}/ws/${data.id}`);

        ws.onopen = () => {
            setSocket(ws);
            
        };
        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);

                if (response.action === 'create_column') {
                    getAllLists();
                    const newList = JSON.parse(response.data);
                    const { created_at, ...newListWithoutCreatedAt } = newList
                    setDataList((prevData) => ({
                        ...prevData,
                        lists: [...(prevData.lists || []), {...newListWithoutCreatedAt, cards: []}],
                    }));

                    console.log(dataList)

                } else if (response.action === 'update_column') {
                    const updatedList = JSON.parse(response.data); // Supondo que o response.data contenha a lista atualizada

                    // Atualiza a lista no estado
                    setDataList((prevData) => ({
                        ...prevData,
                        lists: prevData.lists.map((list) =>
                            list.id === updatedList.id ? updatedList : list // Substitui a lista correspondente
                        ),
                    }));
                } else if (response.action === 'delete_column') {

                    console.log(response.data)

                    // Atualiza a lista no estado
                    setDataList((prevData) => ({
                        ...prevData,
                        lists: prevData.lists.filter((list) =>
                            list.id !== response.data
                        ),
                    }));

                    console.log(dataList)
                }
            } catch (error) {
                console.error('Erro ao processar a mensagem WebSocket:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('Erro WebSocket:', error);
        };

        ws.onclose = (event) => {
            console.log('Conexão WebSocket fechada:', event);
        };

        return () => {
            if (ws) {
                console.log('Fechando WebSocket');
                ws.close();
            }
        };
    }, [data.id, setData, url]);

    useEffect(()=> {
        setDataList(data)
    }, [data])

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
        console.log('all');

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
            <div style={{ padding: '20px' }}>{dataList.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', height: 'calc(-190px + 100vh)' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        {dataList.lists.length > 0 ? (
                            dataList.lists.map((list) => (
                                <List key={list.id} id={list.id} title={list.title} cards={list.cards!} boardId={dataList.id} position={list.position} />
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
                                    <Input placeholder='Digite o nome da lista...' onChange={handleInputListName} onEnter={handleAddList} value={name} />
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

            <Button text="Ver Membros" onClick={openMembers} style={{ position:'fixed', top:'76px', right: '40px'}} />
            <ChatBot id={data.id}/>

        </div>
    );
};

export default Board;
