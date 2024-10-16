import React from 'react'
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
    cards: Card[]; 
}

const List: React.FC<ListProps> = ({ id, title, cards }) => {
    const handleOpenConfig = () => {
        //+adicionar cor, mover, editar o nome (dialog para tal?)
        console.log('abrir congigurações da lista!');

    };
    const handleAddCard = () => {
        //+fazer um fetch para adicionar a lista de cards e limpar o input
        console.log('card adicionado!');

    };
    const handleCancelAddCard = () => {
        //+fechar e limpar o imput
        console.log('operação cancelada');

    };
    const handleopenDialog = () => {
        //+mudar visibilidade do card
    }

    //+usestate para armazenar os cards do board

    return (
        <div>
            {/* vai ter uma altura maxima (calculada) */}
            <div style={{width:'250px', backgroundColor:'#000', color:'#FFF', padding:'10px', borderRadius:'10px'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding:'10px'}}>
                    <div>{title}</div>
                    <Button icon='more_vert' onClick={handleOpenConfig} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap:'10px'}}>
                    {/*quando hover vai ter um scroll */}
                    {cards.map((card: Card, index) => (
                        <Card key={index} title={card.title} description={card.description} />
                    ))}

                </div>
                <div style={{display:'none'}}>
                    <Input placeholder='Insira um título' />
                    <Button text='Adicionar card' onClick={handleAddCard} />
                    <Button text='Cancelar' onClick={handleCancelAddCard} />
                </div>
            </div>
            <Dialog title='Editar lista' isOpen={false} onClose={handleopenDialog}>
                {/* fazer o input receber o valor do titulo atual */}
                <Input label='Alterar título' />
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
                </div>
            </Dialog>
        </div>
    )
}

export default List
