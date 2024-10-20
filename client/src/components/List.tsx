import React, { useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import Dialog from './Dialog/Dialog';
import Card from './Card';
import ErrorMessage from './ErrorMessage';
import { describe } from 'node:test';

interface Card {
    id?: string;
    title: string;
    description: string;
    column_id: string;
    priority?: string;
}

interface ListProps {
    id: string;
    title: string;
    initialCards?: Card[];
    cards?: Card[];
    users?: user[];
    boardId: string;
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
}

const List: React.FC<ListProps> = ({ id, title, initialCards = [], cards = [], boardId }) => {
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
    const [cardList, setCardList] = useState<Card[]>(initialCards.length > 0 ? initialCards : cards);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [selectedColor, setSelectedColor] = useState(selectedCard?.priority);
    const [message, setMesage] = useState("");
    const [visibleError, setVisibleError] = useState("");
    const [sucsesMesage, setSucsesMesage] = useState(false);

    const url = process.env.REACT_APP_API_URL;

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
    };

    const handleOpenInfoCard = async (card: Card) => {
        setSelectedCard(card);
        const allColums = await getAllLists();
        setAllList(allColums);
        setSelectedColor(card.priority);
        setIsDialogCardOpen(true);
    };

    const handleCloseInfoCard = () => {
        setMesage("");
        setVisibleError("");
        setIsDialogCardOpen(false);
        setSucsesMesage(false);
        setSelectedCard(null);
    };

    const handleSaveConfigList = async () => {
        if (titleList === "") {
            setMesage("O título da lista não pode estar vazio!");
            setVisibleError("listError")
            return;
        }

        updateList(titleList);
    };

    const handleSaveConfigCard = async (card: Card, cardId: string) => {
        if (card.title === "") {
            setMesage("O título não pode estar vazio!");
            setVisibleError("CardError")
            return;
        }
        //!ainda não pode trocar a coluna do card... tem de implementar
        const newCard = {
            ...card,
            column_id: selectedListId,
            priority: selectedColor!
        };
        const isUpdated = await updateCard(newCard, cardId);
        if (isUpdated) {
            setSucsesMesage(true);
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
        };

        const newCard = await addCard(dataCard);
        if (newCard) {
            setCardList((prevCards) => [...prevCards, newCard]);
        }
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
        const membersInBoard = await getMembersInBoard(boardID)
        const hasMemberInBoard = membersInBoard.some((member: { email: string }) => member.email === emailUser);

        if (hasMemberInBoard) {
            const clearInput = await addMembrerInCard(cardId, emailUser,);
            if (clearInput) {
                setUserEmail("");
            }
        } else {
            setMesage("O usuário não pertence ao projeto!");
            setVisibleError("addUserError");
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        deletCard(cardId);
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
            // const updateCard = await response.json();
            // return updateCard.data;
            return true;
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
                console.log('Erro ao pegar listas');
                return;
            }

            const allLists = await response.json();
            return allLists.data;
        } catch (error) {
            console.error('Erro ao pegar listas:', error);
        }
    }

    const getMembersInBoard = async (board_id: string) => {
        try {
            const response = await fetch(`${url}/board/membersInBoard/${board_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                console.log('Erro ao buscar membros do board');
                return false;
            }
            const members = await response.json()
            return members.data;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const addMembrerInCard = async (cardId: string, email: string) => {

        const data = {
            emailUser: email
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
                console.log('Erro ao pegar os membors do card');
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
                console.log('Erro ao remover o membro do card');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const deletCard = async (CardId: string) => {
        try {
            const response = await fetch(`${url}/card/${CardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                console.log('Erro ao deletar card da lista');
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
            <div style={{ width: '270px', backgroundColor: color, color: '#000', fontWeight: 500, padding: '10px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(-220px + 100vh)' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                    <div>{title}</div>
                    <Button icon='more_vert' onClick={handleOpenConfig} className='configList' style={{ backgroundColor: color }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '8px' }}>
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
                        <Button text=' + Adicionar um card' style={{ width: '100%' }} onClick={() => setIsMenuAddCardOpen(true)} />
                    )}
                    {isMenuAddCardOpen && (
                        <div>
                            <Input placeholder='Insira um título' onChange={handleNameChange} value={name} />
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
                <div>
                    <Button icon='delete' text='deletar lista' onClick={handeleDeleteList} className='delList' />
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
                            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>Mover card</div>
                                <select name="Listas" id="" onChange={handleListChange} style={{ outline: 'none', border: '1px solid #2c3e50', padding: '8px', borderRadius: '8px', width: '100%' }}>
                                    {allLists?.map(list => (
                                        <option key={list.id} value={list.id}>{list.title}</option>
                                    ))}
                                </select>
                            </div> */}
                            <Button icon='delete' text='Deletar card' onClick={() => handleDeleteCard(selectedCard.id!)} className='delCard' />
                        </div>
                        <div style={{ width: '314px' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>Prioridade</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                                        <div onClick={() => handleSelectColor("Nenhuma")}style={{backgroundColor: '#fefefe',width: '150px',height: '24px',borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Nenhuma" ? '1px solid #9e9e9e' : 'none'}}>Nenhuma</div>
                                        <div onClick={() => handleSelectColor("Baixa")} style={{backgroundColor: '#6767e74a',width: '150px',height: '24px',borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Baixa" ? '1px solid #6767e7c9' : 'none'}}>Baixa</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                                        <div onClick={() => handleSelectColor("Média")} style={{backgroundColor: '#ffc1074a', width: '150px', height: '24px', borderRadius: '4px',cursor: 'pointer', textAlign: 'center', border: selectedColor === "Média" ? '1px solid #ff980070' : 'none'}}>Média</div>
                                        <div onClick={() => handleSelectColor("Alta")} style={{ backgroundColor: '#e367674a', width: '150px', height: '24px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', border: selectedColor === "Alta" ? '1px solid #e36767d9' : 'none'}}>Alta</div>
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
                        <div style={{color:'#347934', fontWeight:'500',marginBottom: '16px',justifyContent:'center',display:'flex'}}>Alterações salvas com sucesso!</div>
                    )}
                    <Button onClick={() => handleSaveConfigCard(selectedCard!, selectedCard?.id!)} text='Salvar Alterações' style={{ margin: '0 auto' }} />
                </div>
            </Dialog>
        </div>
    );
};

export default List;
