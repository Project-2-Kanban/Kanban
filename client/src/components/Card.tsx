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

    return (
        <div style={{backgroundColor:color, color:'#000',borderRadius:'10px', padding:'10px', cursor:'pointer'}} onClick={handleClick}>
            <div>{title}</div>
            <div>{description}</div>
        </div>
    )
}

export default Card;
