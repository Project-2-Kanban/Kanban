import React, { useState, useEffect } from 'react'
import Input from './Input/Input'
import Button from './Button/Button'
import Dialog from './Dialog/Dialog'
import ProjectCard from './ProjectCard'
import UserMenu from './UserMenu'
import './Member.css'
import { useUser } from '../context/UserContext'

interface MembersProps {
  id: number;
  title: string;
}
const Members:React.FC<MembersProps> = ({id, title})=> {

let membros = [
  {
    "nome": "Maci",
    "email": "Derick48@yahoo.com",
    "inicial": "Cw",
    "color": "#cfdacf"
  },
  {
    "nome": "Mayra",
    "email": "Serenity_Pouros-Renner39@hotmail.com",
    "inicial": "Jw",
    "color": "#e28cae"
  },
  {
    "nome": "Francisco",
    "email": "Wendell62@hotmail.com",
    "inicial": "Bz",
    "color": "#e3fcea"
  },
  {
    "nome": "Birdie",
    "email": "Marcellus.Lang@yahoo.com",
    "inicial": "bv",
    "color": "#db1fe7"
  },
  {
    "nome": "Darren",
    "email": "Lilly_Corkery59@gmail.com",
    "inicial": "sl",
    "color": "#71bfa4"
  },
  {
    "nome": "Eriberto",
    "email": "Cesar7@gmail.com",
    "inicial": "az",
    "color": "#ed496c"
  },
  {
    "nome": "Mustafa",
    "email": "Randall_Klein78@gmail.com",
    "inicial": "Sm",
    "color": "#478fef"
  },
  {
    "nome": "Gisselle",
    "email": "Delaney49@gmail.com",
    "inicial": "dV",
    "color": "#aef3dd"
  },
  {
    "nome": "Jalyn",
    "email": "Myrtice_Ratke49@hotmail.com",
    "inicial": "MP",
    "color": "#fabdaa"
  },
  {
    "nome": "Alyson",
    "email": "Arlie.Feest64@yahoo.com",
    "inicial": "HL",
    "color": "#c6d5f1"
  },
  {
    "nome": "Eldon",
    "email": "Angelita.Becker@gmail.com",
    "inicial": "Xj",
    "color": "#13e9ae"
  },
  {
    "nome": "Bart",
    "email": "Tristian.Schamberger@gmail.com",
    "inicial": "rN",
    "color": "#a5cfc9"
  },
  {
    "nome": "Emanuel",
    "email": "Wilma.Dickinson65@yahoo.com",
    "inicial": "YE",
    "color": "#fb132d"
  },
  {
    "nome": "Minnie",
    "email": "Odessa.Doyle@gmail.com",
    "inicial": "AA",
    "color": "#d2ad3c"
  },
  {
    "nome": "Charley",
    "email": "Chadd_Kulas@hotmail.com",
    "inicial": "jx",
    "color": "#60dfaf"
  },
  {
    "nome": "Kaylah",
    "email": "Jack.Will53@hotmail.com",
    "inicial": "lQ",
    "color": "#596e5a"
  },
  {
    "nome": "Alaina",
    "email": "Caleb80@yahoo.com",
    "inicial": "Qk",
    "color": "#bddbbb"
  },
  {
    "nome": "Giovanni",
    "email": "Dejon71@yahoo.com",
    "inicial": "YE",
    "color": "#f072f2"
  },
  {
    "nome": "Marvin",
    "email": "Fern76@hotmail.com",
    "inicial": "vL",
    "color": "#a7f75c"
  },
  {
    "nome": "Thaddeus",
    "email": "Mozell_Krajcik79@yahoo.com",
    "inicial": "Dl",
    "color": "#6defbb"
  }
]


  const [userFind, setUserFind] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameMember, setNameMember] = useState("");
  const url = process.env.REACT_APP_API_URL;


  const { user } = useUser();

  const [membrosList, setMembrosList] = useState(membros)

  let membrosFilter = membrosList.filter((m) => m.nome.toLowerCase().includes(userFind.toLowerCase()))

  interface Members {
    id: number;
    name: string;
    email: string;
  }

  const [member, setMember] = useState<Members[]>([]);

  // + para quando hover a rota de pegar os projetos do user:
  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch(`${url}/membersInBoard/:board_id`, {
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

  const handleAddProject = (newMember: Members) => {
    setMember((prevMember) => [...prevMember, newMember]);
  };

  const handleUserFind = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserFind(event.target.value);
    console.log(userFind)

  }

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
    // const newMember: Members = {
    //   id: Date.now(),
    //   email: 'email',
    //   name: nameMember,

    // };

    const novoMembro = {
      nome: nameMember,
      email: 'test@mail',
      inicial: 'GM',
      color: 'darkgreen'
    }

    membros.push(novoMembro);

    // handleAddProject(newMember);
    // fetch(`${url}/board/create`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify(newMember),
    // });

    setNameMember("");
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    console.log(event.currentTarget.id);

    const nomeid = event.currentTarget.id;

    const index = membrosList.findIndex((m) => m.nome === nomeid);

    console.log(index)

    if (index !== -1) {
      
      const updatedMembros = [...membrosList];
      updatedMembros.splice(index, 1);
  
      
      setMembrosList(updatedMembros);
    }
  }

  return (
    <div id='members'>
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
          {membrosFilter.length > 0 ? (
            membrosFilter.map((membro) => (
              <div style={{ width: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: '', }}>
                  <div className="userIcon" style={{ marginRight: '10px', fontWeight: 'bold', backgroundColor: membro.color, color: '#000', cursor: 'default' }}>{membro.inicial}</div>
                  <div>
                    <h3>{membro.nome}</h3>
                    <p>{membro.email}</p>
                  </div>
                </div>
                <button id={membro.nome} onClick={handleDeleteClick} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'red', cursor: 'pointer' }}>Remover</button>
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
