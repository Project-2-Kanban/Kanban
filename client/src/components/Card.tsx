import React from 'react'

interface CardProps {
    id?: string;
    title: string;
    description: string;
    column_id: string;
    color:string;
    onClick: (event: React.MouseEvent, data: { title: string; column_id: string; description: string; color: string }) => void;
}

const Card: React.FC<CardProps> = ({ title, description, column_id, color, onClick }) => { 
    const handleClick = (event: React.MouseEvent) => {
        const data = {
            title,
            column_id, 
            description,
            color,
        };
        onClick(event, data);
    }
    let tag;
    if (color==="#6767e74a") {
        tag="Baixa";
    } else if (color==="#ffc1074a") {
        tag="Média";
    } else if (color==="#ff00004a") {
        tag="Alta";
    }else{
        tag="";
    }
    return (
        <div style={{backgroundColor:'#fefefe', color:'#000',borderRadius:'10px', padding:'10px', cursor:'pointer'}} onClick={handleClick}>
            <div style={{backgroundColor:color, width:'50px', height:'16px', marginBottom:'4px',borderRadius:'4px', textAlign:'center',fontSize:'0.8rem', padding:'1px'}}>{tag}</div>
            <div>{title}</div>
        </div>
    )
}

export default Card;
