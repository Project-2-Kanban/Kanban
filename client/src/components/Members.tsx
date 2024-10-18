import React, { useState, useEffect } from 'react'
import Input from './Input/Input'
import Button from './Button/Button'
import Dialog from './Dialog/Dialog'
import ProjectCard from './ProjectCard'
import UserMenu from './UserMenu'
import './Member.css'
import { useUser } from '../context/UserContext'
import { response } from 'express'
import Home from './Home'

interface MembersProps {
  id: number;
  title: string;
  onBack:(id: number) => void;
}

const Members:React.FC<MembersProps> = ({id, title, onBack})=> {

  const [userFind, setUserFind] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameMember, setNameMember] = useState("");
  const url = process.env.REACT_APP_API_URL;


  const { user, userInitials, getUserColor } = useUser();

  interface Members {
    id?: number | string;
    name?: string;
    email: string;
  }
  
  const [member, setMember] = useState<Members[]>([]);

  


  // + para quando hover a rota de pegar os projetos do user:
  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch(`${url}/board/membersInBoard/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const result = await response.json();

        // Verifica se a resposta contém uma lista de projetos ou uma mensagem indicando que não há quadros
        if (Array.isArray(result.data)) {
          setMember(result.data);
        } else if (result.data === "Você não está em nenhum quadro.") {
          setMember([]); // Limpa os projetos e deixa a mensagem de vazio
        } else {
          console.error('Resposta inesperada', result);
        }
      } catch (error) {
        console.error('Erro ao buscar membros', error);
      }
    }

    fetchMembers();
  }, [url]);

  const handleAddMember = (newMember: Members) => {
    setMember((prevMember) => [...prevMember, newMember]);
  };

  const handleUserFind = (event: React.ChangeEvent<HTMLInputElement>) => {
    const user = event.target.value;
    setUserFind(user); // Atualiza o estado de busca

  }

  const filteredMembers = member.filter((membro) =>
    membro.name?.toLowerCase().includes(userFind.toLowerCase())
  );

  console.log(filteredMembers)

  const handleAddClick = () => {
    setIsDialogOpen(true);
    console.log(isDialogOpen)
    /*
    -fazer um get para pegar os seguntes dados:
    +nome
    +email
    +projetos { nome do projeto, tipo de acesso, data de criação do projeto}
    */
  }

  const handleCloseDialog = () => {
    setNameMember("");
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameMember(e.target.value);
  };

  const handleConfirmClick = (event: React.MouseEvent) => {
    const newMember: Members = {
      email: nameMember,
    };

    // handleAddMember(newMember);
    // fetch(`${url}/board/addMember/${id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify(newMember),
    // });

    addMember(newMember)


    setNameMember("");
    setIsDialogOpen(false);
  };

  const addMember = async (newMember: Members) => {
    try {
      const response = await fetch(`${url}/board/addMember/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newMember),
      });

      const result = await response.json();

      console.log(result.data.member.member.user)

      const dados = result.data.member.member.user;

      const member: Members = {
        name: dados.name,
        email: dados.email
      }

    handleAddMember(member);

    } catch (error) {
      console.error('Erro ao buscar membros', error);
    }
  }

  const handleDeleteClick = (event: React.MouseEvent) => {
    console.log(event.currentTarget.id);

    const userId = event.currentTarget.id;
    console.log(member[1].id)

    const index = member.findIndex((m) => m.id === userId);

    console.log(index)

    if (index !== -1) {

      fetch(`${url}/board/removeMember/${id}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const deleteMembers = member.filter((m) => m.id !== userId)

      setMember(deleteMembers)
      
    }
  }

  return (
    <div id='members'>
      <p>
        <button onClick={() => onBack(id)}>voltar</button>
      </p>
      <h2>{title}</h2>
      <h3>Lista de Membros:</h3>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Input
          name='shearch'
          placeholder='Filtar por nomes...'
          value={userFind}
          onChange={handleUserFind}
          style={{ width: '150px' }}
        />
        <Button text='Adicionar usuário' onClick={handleAddClick} className='creatBoard' style={{ height: '40px' }} />
      </div>
      <div id='list-member'>
        <div id='title'>
          <div style={{ fontSize: '32px', color: '#2C3E50', textAlign: 'center' }}>Nomes</div>
        </div>
        <div id='resultados' style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '700px', width: '100%', alignItems: 'center' }}>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((m) => (
              <div id={`${m.id}`} style={{ width: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: '', }}>
                  <div className="userIcon" style={{ marginRight: '10px', fontWeight: 'bold', backgroundColor: getUserColor(m.name || ""), color: '#000', cursor: 'default' }}>{userInitials(m.name || "")}</div>
                  <div>
                    <h3>{m.name}</h3>
                    <p>{m.email}</p>
                  </div>
                </div>
                <button id={`${m.id}`} onClick={handleDeleteClick} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'red', cursor: 'pointer' }}>Remover</button>
              </div>

            ))
          ) : (
            <p>Não existe nenhum usuário nesse quadro</p>
          )}
        </div>
      </div>
      <Dialog title="Adicionar usuário" isOpen={isDialogOpen} onClose={handleCloseDialog}>
        <div>
          <Input
            label='E-mail:'
            type="text"
            name="email"
            placeholder="Digite o e-mail do usuário..."
            value={nameMember}
            onChange={handleNameChange}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button text="Continuar" onClick={handleConfirmClick} className='login' />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default Members
