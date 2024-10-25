import React from 'react'

interface CardProps {
    id?: string;
    title: string;
    description: string;
    column_id: string;
    priority: string;
    onClick: (event: React.MouseEvent, data: { title: string; column_id: string; description: string; priority: string; }) => void;
}

const Card: React.FC<CardProps> = ({ title, description, column_id, priority, onClick }) => {
    const handleClick = (event: React.MouseEvent) => {
        const data = {
            title,
            column_id,
            description,
            priority,
        };
        onClick(event, data);
    }
    let color;
    if (priority === "Baixa") {
        color = "#6767e74a";
    } else if (priority === "Média") {
        color = "#ffc1074a";
    } else if (priority === "Alta") {
        color = "#ff00004a";
    } else {
        color = "#fefefe";
    }
    return (
        <div style={{ backgroundColor: '#fefefe', color: '#000', borderRadius: '10px', padding: '10px', cursor: 'pointer' }} onClick={handleClick}>
            {priority !== "Nenhuma" && (
                <div style={{
                    backgroundColor: color, width: '50px', height: '16px', marginBottom: '4px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', padding: '1px'}}>{priority}</div>
            )}
            <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '300px'
            }} title={title}>{title}</div>
        </div>
    )
}

export default Card;
