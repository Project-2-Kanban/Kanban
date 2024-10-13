import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Dialog from "../components/Dialog/Dialog";
import Button from "../components/Button/Button";
import Input from '../components/Input';
import { useUser } from '../context/UserContext';

const InitialPage: React.FC = () => {
  const { setUser, userInitials, getUserColor } = useUser();
  const [isDialogLoginOpen, setIsDialogLoginOpen] = useState(false);
  const [isDialogSignUpOpen, setIsDialogSignUpOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;

  const handleInputChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeSignUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${url}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        alert('Email ou senha errado');
        return;
      }
      const data = await response.json();
      const initials = userInitials(data.data.name);
      const userColor = getUserColor(name);

      const userData = { name: data.data.name, email: data.data.email, initials, userColor };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsDialogSignUpOpen(false);
      setIsDialogLoginOpen(false);
      navigate('/main');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };



  const handleSignUp = async () => {
    if (!name || !surname || !signUpData.email || !signUpData.password || !passwordConfirm) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (signUpData.password !== passwordConfirm) {
      alert("As senhas não coincidem!");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(signUpData.email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    const fullName = `${name} ${surname}`;
    setSignUpData({
      ...signUpData,
      name: fullName,
    });

    try {
      const response = await fetch(`${url}/user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...signUpData, name: fullName }),
      });

      if (!response.ok) {
        alert('Cadastro falhou');
        return;
      }

      loginData.email = signUpData.email;
      loginData.password = signUpData.password;

      await handleLogin();
    } catch (error) {
      console.error('Erro ao tentar cadastrar:', error);
    }
  };

  const handleLoginClick = () => {
    setIsDialogLoginOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setLoginData(({email: '', password: '' }));
    setIsDialogLoginOpen(false);
  };

  const handleSignUpClick = () => {
    setIsDialogSignUpOpen(true);
  };

  const handleCloseSignUpDialog = () => {
    setSignUpData({name:'', email: '', password: '' });
    setName("");
    setSurname("");
    setPasswordConfirm("");
    setIsDialogSignUpOpen(false);
  };

  return (
    <div>
      <NavBar title='Logo' button={<Button text="Entrar" onClick={handleLoginClick} className='login' />} />
      <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 66px)', backgroundColor: '#2C3E50' }}>
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '80%' }}>
            <p style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', fontSize: '1.5rem', color: '#BDC3C7' }}>
              <span style={{ fontSize: '4rem' }}>Bem-vindos!</span>
              <span>Crie, categorize e acompanhe o progresso de suas tarefas em um fluxo contínuo, garantindo produtividade e controle em cada etapa do seu projeto.</span>
              <span>Comece agora e veja suas ideias fluírem!</span>
              <span>Faça seu cadastro:</span>
            </p>
            <Button text='Cadastrar' onClick={handleSignUpClick} className='register' />
          </div>
        </div>
        <div style={{ width: '40%' }}>imagem</div>
      </div>
      <Dialog title="Login" isOpen={isDialogLoginOpen} onClose={handleCloseLoginDialog}>
        <div>
          <Input
            label='Digite o e-mail'
            type="text"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleInputChangeLogin}
          />
          <Input
            label='Senha'
            type="password"
            name="password"
            placeholder="senha"
            value={loginData.password}
            onChange={handleInputChangeLogin}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button text="Continuar" onClick={handleLogin} className='login' />
          </div>
        </div>
      </Dialog>
      <Dialog title="Cadastro" isOpen={isDialogSignUpOpen} onClose={handleCloseSignUpDialog}>
        <div>
          <Input
            label='Nome'
            type="text"
            name="name"
            placeholder="Nome"
            value={name}
            onChange={handleNameChange}
          />
          <Input
            label='Sobrenome'
            type="text"
            name="surname"
            placeholder="Sobrenome"
            value={surname}
            onChange={handleSurnameChange}
          />
          <Input
            label='Email'
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={handleInputChangeSignUp}
          />
          <Input
            label='Senha'
            type="password"
            name="password"
            placeholder="Senha"
            value={signUpData.password}
            onChange={handleInputChangeSignUp}
          />
          <Input
            label='Confirmar senha'
            type="password"
            name="passwordConfirm"
            placeholder="Senha"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button text="Continuar" onClick={handleSignUp} className='login' />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default InitialPage;
