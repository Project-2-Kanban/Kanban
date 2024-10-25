import React, { useEffect, useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import Dialog from './Dialog/Dialog';
import Card from './Card';
import ErrorMessage from './ErrorMessage';
import './List'

interface Card {
    id?: string;
    title: string;
    description: string;
    column_id: string;
    priority?: string;
    board_id?: string;
}

interface ListProps {
    id: string;
    title: string;
    initialCards?: Card[];
    cards: Card[];
    users?: user[];
    boardId: string;
    position: string;
    onBack?: string
}
interface user {
    id: string;
    name: string;
    email: string;
}

interface list {
    id: string;
    title: string;
    board_id: string;
    created_at: string;
    position: string;
}

interface response {
    success: boolean;
    data: any;
}

const List: React.FC<ListProps> = ({ id, title, initialCards = [], cards, boardId, position }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddMemnberOpen, setMemberOpen] = useState(true);
    const [isDialogCardOpen, setIsDialogCardOpen] = useState(false);
    const [isAddCardOpen, setIsAddCardOpen] = useState(true);
    const [isMenuAddCardOpen, setIsMenuAddCardOpen] = useState(false);
    const [isMenuUserInCardOpen, setIsMenuUserInCardOpen] = useState(true);
    const [name, setName] = useState("");
    const [titleList, setTitle] = useState(title);
    const [userEmail, setUserEmail] = useState("");
    const [userList, setUserList] = useState<user[]>();
    const [allLists, setAllList] = useState<list[]>();
    const [selectedListId, setSelectedListId] = useState('');
    const [cardList, setCardList] = useState<Card[]>(cards);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [selectedColor, setSelectedColor] = useState(selectedCard?.priority);
    const [message, setMesage] = useState("");
    const [visibleError, setVisibleError] = useState("");
    const [sucsesMesage, setSuccessMesage] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {


        const ws = new WebSocket(`ws://localhost:3000/api/ws/${boardId}`);

        ws.onopen = () => {
            setSocket(ws);
        };
        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);


                const responseParce = JSON.parse(response.data);
                if (response.action === 'create_card') {

                    if (id === responseParce.column_id) {

                        setCardList((prevCards) => [...prevCards, responseParce]);
                    }

                } else if (response.action === 'update_card') {
                    setCardList((prevCards) =>
                        prevCards.map((card) =>
                            card.id === responseParce.id ? responseParce : card
                        )
                    );
                } else if (response.action === 'delete_card') {
                    setCardList((prevCardList) => {
                        const updatedeList = prevCardList.filter(card => card.id !== responseParce);
                        return updatedeList;
                    })
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
    }, [boardId, setUserList]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleMembrsCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    };

    const handleListChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedListId(event.target.value);
    };

    const handleSelectColor = (priority: string) => {
        setSelectedColor(priority);
    }

    const handleOpenConfig = () => {
        setIsDialogOpen(true);
    };

    const handleCloseConfig = () => {
        setMesage("");
        setVisibleError("listError")
        setIsDialogOpen(false);
        setSuccessMesage(false);
    };

    const handleOpenInfoCard = async (card: Card) => {
        setSelectedCard(card);
        const allColums = await getAllLists();
        setAllList(allColums);
        setSelectedColor(card.priority);
        setIsDialogCardOpen(true);
        setSuccessMesage(false)
    };

    const handleCloseInfoCard = () => {
        setMesage("");
        setVisibleError("");
        setIsDialogCardOpen(false);
        setSuccessMesage(false);
        setSelectedCard(null);
    };

    const handleSaveConfigList = async () => {
        setMesage('')
        setSuccessMesage(false)
        if (titleList === "") {
            setMesage("O título da lista não pode estar vazio!");
            setVisibleError("listError")
            return;
        }

        const success = await updateList(titleList);
        if(success) {
            setSuccessMesage(true);
        }
    };

    const handleSaveConfigCard = async (card: Card, cardId: string, selectedListId: string) => {
        setSuccessMesage(false)
        if (card.title === "") {
            setMesage("O título não pode estar vazio!");
            setVisibleError("CardError")
            return;
        }

        if (selectedListId === "") {

            selectedListId = selectedCard!.column_id;
        }

        const updatedCard = {
            ...card,
            column_id: selectedListId,
            priority: selectedColor!,
            board_id: boardId,
        };

        const isUpdated = await updateCard(updatedCard, cardId);
        if (isUpdated && isUpdated.success) {
            setSuccessMesage(true);
            setCardList((prevCards) =>
                prevCards.map((card) =>
                    card.id === updatedCard.id ? updatedCard : card
                )
            );
        }
    };

    const handleOpenAddUserInCard = () => {
        setMemberOpen(false);
    };

    const handleCloseAddUserInCard = () => {
        setUserEmail("");
        setMesage("");
        setVisibleError("addUserError")
        setMemberOpen(true);
    };

    const handleOpenUserInCard = (cardId: string) => {
        getMembersInCards(cardId);
        setIsMenuUserInCardOpen(false);
    };

    const handlCloseUserInCard = () => {
        setIsMenuUserInCardOpen(true)
    };

    const handleRemoveMembrerInCard = async (CardId: string, memberId: string) => {
        setUserList((prevUserList = []) => prevUserList.filter(user => user.id !== memberId));

        const isDeleted = await removeMemberCard(CardId, memberId);

        if (!isDeleted) {
            const membrers = await getMembersInCards(CardId);
            setUserList(membrers);
        }
    };

    const handleAddCard = async () => {
        if (name === "") {
            setMesage("O título não pode estar vazio!");
            setVisibleError("addCardError");
            return;
        }
        const dataCard = {
            title: name,
            column_id: id,
            description: "",
            priority: "Nenhuma",
            board_id: boardId
        };

        addCard(dataCard);

        setName("");
        setIsAddCardOpen(true);
        setIsMenuAddCardOpen(false);
    };

    const handleCancelAddCard = () => {
        setMesage("");
        setVisibleError("addCardError");
        setName("");
        setMesage("");
        setVisibleError("listError")
        setIsAddCardOpen(true);
        setIsMenuAddCardOpen(false);
    };

    const handleComfirmAddUserInCard = async (cardId: string, emailUser: string, boardID: string) => {
        const clearInput = await addMembrerInCard(cardId, emailUser,);
        if (clearInput) {
            setUserEmail("");
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        deleteCard(cardId);
        handleCloseInfoCard();
        setIsDialogOpen(false);
    }

    const addCard = async (data: Card) => {
        try {
            const response = await fetch(`${url}/card/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                return false;
            }
            const createdCard = await response.json();

            return createdCard.data;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const updateCard = async (data: Card, cardId: string) => {
        setMesage("");
        setSuccessMesage(false);
        try {
            const response = await fetch(`${url}/card/update/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                setMesage("Erro ao alterar o card.");
                setVisibleError("CardError")
                return false;
            }
            const result = await response.json()

            const dataResponse: response = {
                success: true,
                data: result.data
            }
            return dataResponse;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const getAllLists = async () => {
        try {
            const response = await fetch(`${url}/column/get/all/${boardId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                return;
            }

            const allLists = await response.json();
            return allLists.data;
        } catch (error) {
            console.error('Erro ao pegar listas:', error);
        }
    }

    const addMembrerInCard = async (cardId: string, email: string) => {

        const data = {
            emailUser: email,
            board_id: boardId
        }
        try {
            const response = await fetch(`${url}/card/addMemberCard/${cardId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                setMesage("O usuário não pertence ao projeto!");
                setVisibleError("addUserError");
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const getMembersInCards = async (CardId: string) => {
        try {
            const response = await fetch(`${url}/card/membersInCards/${CardId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                return false;
            }
            const membersInCards = await response.json();
            setUserList(membersInCards.data)
            return membersInCards.data;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const removeMemberCard = async (CardId: string, memberId: string) => {

        try {
            const response = await fetch(`${url}/card/removeMemberCard/${CardId}/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const deleteCard = async (CardId: string) => {
        try {
            const data = { board_id: boardId }
            const response = await fetch(`${url}/card/${CardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                return false;
            }

        } catch (error) {
            console.error('Error logging in:', error);
        }
    }
    const updateList = async (title: string) => {
        const data = {
            title: title,
        }

        try {
            const response = await fetch(`${url}/column/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                setMesage("Erro ao atualizar lista.");
                setVisibleError("listError")
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const deletList = async () => {

        try {
            const response = await fetch(`${url}/column/${boardId}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                setMesage("Erro ao deletar lista.");
                setVisibleError("listError")
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const handeleDeleteList = async () => {
        const isDeleted = await deletList();
        if (isDeleted) {
            setIsDialogOpen(false);
        }
    }
    const color = '#779CAB';

    return (
        <div>
            <div style={{ width: '270px', backgroundColor: color, color: '#000', fontWeight: 500, padding: '10px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(-300px + 100vh)' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                    <div style={{fontWeight:'bold', fontSize:'23px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px'}} title={title}>{title}</div>
                    <Button icon='more_vert' onClick={handleOpenConfig} className='configList' style={{ backgroundColor: color }} />
                </div>
                <div className='test' style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '8px' }}>
                    {cardList.length > 0 ? (
                        cardList.map((card: Card, index) => (
                            <Card key={index} title={card.title} description={card.description} priority={card.priority!} column_id={card.column_id} onClick={() => handleOpenInfoCard(card)} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', color: '#777' }}>Crie um card!</div>
                    )}
                </div>
                <div>
                    {!isMenuAddCardOpen && (
                        <Button icon='add' size='22px' pad='0 0 0 5px ' text='Adicionar um card' style={{ width: '262px' }} onClick={() => setIsMenuAddCardOpen(true)} />
                    )}
                    {isMenuAddCardOpen && (
                        <div>
                            <Input placeholder='Insira um título' onChange={handleNameChange} value={name} onEnter={handleAddCard} />
                            <ErrorMessage text={message} style={{ visibility: visibleError === "addCardError" ? 'visible' : 'hidden' }} />

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button text='Adicionar' onClick={handleAddCard} style={{ width: '48%' }} />
                                <Button text='Cancelar' onClick={handleCancelAddCard} style={{ width: '48%' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Dialog title='Editar lista' isOpen={isDialogOpen} onClose={handleCloseConfig}>
                <Input label='Alterar título' placeholder='Título da lista...' value={titleList} onChange={handleTitleChange} />
                <ErrorMessage text={message} style={{ visibility: visibleError === "listError" ? 'visible' : 'hidden' }} />
                {sucsesMesage && (
                    <div style={{ color: '#347934', fontWeight: '500', marginBottom: '16px', justifyContent: 'center', display: 'flex' }}>Alteração salva com sucesso!</div>
                )}
                <div>
                    <Button icon='delete' text='Deletar lista' onClick={handeleDeleteList} className='delList' />
                    <Button onClick={handleSaveConfigList} text='Salvar Alterações' style={{ width: '100%' }} />
                </div>
            </Dialog>
            <Dialog title='Informações do Card' isOpen={isDialogCardOpen} onClose={handleCloseInfoCard} style={{ maxWidth: '700px' }}>
                {selectedCard && (
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', height: '400px' }}>
                        <div style={{ width: '314px' }}>
                            <Input label='Título' placeholder='Título do card...' value={selectedCard.title} onChange={(e) => setSelectedCard((prev) => prev ? { ...prev, title: e.target.value } : null)} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                <span>Descrição</span>
                                <textarea rows={4} style={{ borderRadius: '8px', border: 'solid 1px #2C3E50', outline: 'none', padding: '8px' }} name="" id="" value={selectedCard.description} onChange={(e) => setSelectedCard((prev) => prev ? { ...prev, description: e.target.value } : null)} placeholder='Descrição do card...'></textarea>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>Mover card</div>
                                <select name="Listas" id="" onChange={handleListChange} style={{ outline: 'none', border: '1px solid #2c3e50', padding: '8px', borderRadius: '8px', width: '100%', marginBottom: '16px' }}>
                                    {allLists?.map(list => (
                                        <option key={list.id} value={list.id}>{list.title}</option>
                                    ))}
                                </select>
                            </div>
                            <Button icon='delete' text='Deletar card' onClick={() => handleDeleteCard(selectedCard.id!)} className='delCard' />
                        </div>
                        <div style={{ width: '314px' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>Prioridade</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                                        <div onClick={() => handleSelectColor("Nenhuma")} style={{ backgroundColor: '#fefefe', width: '150px', height: '24px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Nenhuma" ? '1px solid #9e9e9e' : 'none' }}>Nenhuma</div>
                                        <div onClick={() => handleSelectColor("Baixa")} style={{ backgroundColor: '#6767e74a', width: '150px', height: '24px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Baixa" ? '1px solid #6767e7c9' : 'none' }}>Baixa</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                                        <div onClick={() => handleSelectColor("Média")} style={{ backgroundColor: '#ffc1074a', width: '150px', height: '24px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Média" ? '1px solid #ff980070' : 'none' }}>Média</div>
                                        <div onClick={() => handleSelectColor("Alta")} style={{ backgroundColor: '#e367674a', width: '150px', height: '24px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Alta" ? '1px solid #e36767d9' : 'none' }}>Alta</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '0', backgroundColor: '#a4aaaf', borderRadius: '8px', marginBottom: '16px' }}>
                                {isAddMemnberOpen && selectedCard.id && (
                                    <Button text='+ Adicionar membro' onClick={handleOpenAddUserInCard} style={{ width: '100%', backgroundColor: '#a4aaaf', borderRadius: '8px', padding: '16px' }} />
                                )}
                                {!isAddMemnberOpen && (
                                    <div style={{ padding: '16px' }}>
                                        <Input placeholder='Email do usuário' onChange={handleMembrsCardChange} label='Adicionar membro' value={userEmail} />
                                        <ErrorMessage text={message} style={{ visibility: visibleError === "addUserError" ? 'visible' : 'hidden' }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Button text='Confirmar' onClick={() => handleComfirmAddUserInCard(selectedCard.id!, userEmail, boardId)} style={{ width: '48%' }} />
                                            <Button text='Fechar' onClick={handleCloseAddUserInCard} style={{ width: '48%' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ backgroundColor: '#a4aaaf', borderRadius: '8px' }}>
                                {isMenuUserInCardOpen ? (
                                    <Button
                                        text='Membros do card'
                                        onClick={() => {
                                            handleOpenUserInCard(selectedCard.id!);
                                            setIsMenuUserInCardOpen(false);
                                        }}
                                        style={{ width: '100%', backgroundColor: '#a4aaaf', borderRadius: '8px', padding: '16px' }}
                                    />
                                ) : (
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>Membros do card</div>
                                            <Button onClick={handlCloseUserInCard} icon='close' className='configList' style={{ backgroundColor: '#a4aaaf' }} />
                                        </div>
                                        {userList && userList.length > 0 ? (
                                            <div>
                                                {userList.map(user => (
                                                    <div
                                                        key={user.id}
                                                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '8px', justifyContent: 'space-between' }}
                                                    >
                                                        <div>{user.name} / {user.email}</div>
                                                        <Button
                                                            onClick={() => handleRemoveMembrerInCard(selectedCard.id!, user.id)}
                                                            icon='delete'
                                                            style={{ marginLeft: '8px', backgroundColor: '#a4aaaf' }}
                                                            className='configList'
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>Ainda não há usuários nesse card.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <ErrorMessage text={message} style={{ visibility: visibleError === "CardError" ? 'visible' : 'hidden' }} />
                    {sucsesMesage && (
                        <div style={{ color: '#347934', fontWeight: '500', marginBottom: '16px', justifyContent: 'center', display: 'flex' }}>Alterações salvas com sucesso!</div>
                    )}
                    <Button onClick={() => handleSaveConfigCard(selectedCard!, selectedCard?.id!, selectedListId!)} text='Salvar Alterações' style={{ margin: '0 auto' }} />
                </div>
            </Dialog>
        </div>
    );
};

export default List;
