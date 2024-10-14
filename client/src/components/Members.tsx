import React, { useState } from 'react'
import Input from './Input/Input'
import Button from './Button/Button'

//!falta estilizar

const Members:React.FC = ()=> {
    const [userFind, setUserFind] = useState("");

    const handleUserFind = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setUserFind(event.target.value);
    }

    const handleSearchClick = ()=>{
        /*
        -fazer um get para pegar os seguntes dados:
        +nome
        +email
        +projetos { nome do projeto, tipo de acesso, data de criação do projeto}
        */
    }

  return (
    <div id='members'>
      <h3>Lista de Membros</h3>
      <div>
        <Input
            name='shearch'
            placeholder='filtar por nomes...'
            value={userFind}
            onChange={handleUserFind}
        />
        <Button text='Buscar usuário' onClick={handleSearchClick} className='creatBoard'/>
      </div>
      <div>
        <div>
            <div style={{width:'60%'}}>Nomes</div>
            <div style={{width:'40%'}}>Projetos</div>
        </div>
        <div id='resultados'>
            {/* criar um componete para o resultado da busca:  <div id='resultado'>
                <div>fulano</div>
                <div>btn com o numero de resiltados encontrados</div>
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default Members
