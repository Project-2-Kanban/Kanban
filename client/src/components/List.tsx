import React, { useState } from 'react'
import Button from './Button/Button'
import Input from './Input/Input'
import Dialog from './Dialog/Dialog';
import Card from './Card';

interface Card {
    title: string;
    description: string;
}

interface ListProps {
    id: string;
    title: string;
    initialCards?: Card[];
    cards?: Card[];
}

const List: React.FC<ListProps> = ({ id, title, initialCards = [], cards = [] }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddCardOpen, setIsAddCardOpen] = useState(true);
    const [isMenuAddCardOpen, setIsMenuAddCardOpen] = useState(false);
    const [name, setName] = useState("");
    const [titleList, setTitle] = useState(title);
    const [cardList, setCardList] = useState<Card[]>(initialCards.length > 0 ? initialCards : cards);
    const url = process.env.REACT_APP_API_URL;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    const handleOpenConfig = () => {
        setIsDialogOpen(true);
    };
    const handleCloseConfig = () => {
        setIsDialogOpen(false);
    }
    const handleSaveConfig = async () => {
        if (name === "") {
            console.log("nome não pode estar vazio");
            return
        }
        const newCard = {
            title: name,
            description: "",
        };

        // try {
        //     const response = await fetch(`${url}/column/update`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: 'include',
        //          body: JSON.stringify({ ...newCard, listId: id }),
        //     });
        //     if (!response.ok) {
        //         console.log('Erro ao adicionar card a lista');
        //         return;
        //     }
        // setCards((prevCards) => [...prevCards, newCard]);
        // } catch (error) {
        //     console.error('Error logging in:', error);
        // }
    }
    const handleOpemMenuAddCard = () => {
        setIsAddCardOpen(false);
        setIsMenuAddCardOpen(true);
    };
    const handleAddCard = async () => {
        if (name === "") {
            console.log("nome não pode estar vazio");
            return
        }
        const data = {
            title: name,
            listId: id,
        };

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
                console.log('Erro ao adicionar card a lista');

                return;
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
        console.log('adicionar card!');
        setName("");
        setIsAddCardOpen(true);
        setIsMenuAddCardOpen(false);

    };
    const handleCancelAddCard = () => {
        setName("");
        setIsAddCardOpen(true);
        setIsMenuAddCardOpen(false);
    };

    const color = '#779CAB'

    return (
        <div>
            <div style={{ width: '270px', backgroundColor: color, color: '#000', fontWeight: 500, padding: '10px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(-220px + 100vh)' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                    <div>{title}</div>
                    <Button icon='more_vert' onClick={handleOpenConfig} className='configList' style={{ backgroundColor: color }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '8px' }}>
                    {cards.length > 0 ? (
                        cards.map((card: Card, index) => (
                            <Card key={index} title={card.title} description={card.description} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', color: '#777' }}>Nenhum card disponível.</div>
                    )}

                </div>
                <div>
                    {isAddCardOpen && (
                        <Button text=' + Adicionar um card' style={{ width: '100%' }} onClick={handleOpemMenuAddCard} />

                    )}
                    {
                        isMenuAddCardOpen && (
                            <div>
                                <Input placeholder='Insira um título' onChange={handleNameChange} value={name} />
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button text='Adicionar card' onClick={handleAddCard} style={{ width: '130px' }} />
                                    <Button text='Cancelar' onClick={handleCancelAddCard} style={{ width: '130px' }} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Dialog title='Editar lista' isOpen={isDialogOpen} onClose={handleCloseConfig}>
                {/* fazer o input receber o valor do titulo atual */}
                <Input label='Alterar título' value={titleList} onChange={handleTitleChange} />
                <div>
                    <p>alterar cor</p>
                    <div>
                        <div>rosa</div>
                        <div>verde</div>
                        <div>azul</div>
                        <div>vermelho</div>
                        <div>cinza</div>
                        <div>amarelo</div>
                        <div>preto</div>
                    </div>
                    <Button onClick={handleSaveConfig} text='Salvar Alterações' />
                </div>
            </Dialog>
        </div>
    )
}

export default List
