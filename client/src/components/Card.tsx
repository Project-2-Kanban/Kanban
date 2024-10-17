import React from 'react'

interface CardProps {
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => { 
    return (
    <div style={{backgroundColor:'#FFF', color:'#000',borderRadius:'10px', padding:'10px'}}>
        {/* <div>
            tag (se hover)
            editar
        </div> */}
      <div>{title}</div>
      <div>{description}</div>
    </div>
  )
}

export default Card
