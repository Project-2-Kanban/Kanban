import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/navBar";
import Dialog from "../components/dialog";
import Button from "../components/Button/Button";
import Input from '../components/input';

//! falta adicionar msgs de erro e fazer verificação do nome, email e senha antes de enviar a requisição

const InitialPage: React.FC = () => {
  const [isDialogLoginOpen, setIsDialogLoginOpen] = useState(false);
  const [isDialogSignUpOpen, setIsDialogSignUpOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name:'', email: '', password: '' });

  const navigate = useNavigate();

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

  const url ='';

  const handleLogin = async () => {
    try {
      const response = await fetch(`${url}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (data.success) {
        setIsDialogLoginOpen(false); 
        navigate('/main');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${url}/user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });
      const data = await response.json();
      if (data.success) {
        setIsDialogSignUpOpen(false); 
        navigate('/main');
      } else {
        alert('Sign up failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleLoginClick = () => {
    setIsDialogLoginOpen(true); 
  };

  const handleCloseLoginDialog = () => {
    setIsDialogLoginOpen(false);
  };

  const handleSignUpClick = () => {
    setIsDialogSignUpOpen(true); 
  };

  const handleCloseSignUpDialog = () => {
    setIsDialogSignUpOpen(false);
  };

  return (
    <div>
      <NavBar title='Logo' login={handleLoginClick} />
      <div style={{display:'flex', flexDirection:'row',height:'calc(100vh - 66px)', backgroundColor:'#2C3E50'}}>
        <div style={{width:'60%',display:'flex',flexDirection:'column',justifyContent:'center', alignItems:'center'}}>
          <div style={{width: '80%'}}>
          <p style={{display: 'flex',flexDirection: 'column',textAlign: 'left', fontSize:'1.5rem', color:'#BDC3C7'}}>
            <span style={{fontSize:'4rem'}}>Bem-vindos!</span>
            <span>Crie, categorize e acompanhe o progresso de suas tarefas em um fluxo contínuo, garantindo produtividade e controle em cada etapa do seu projeto.</span>
            <span>Comece agora e veja suas ideias fluírem!</span>
            <span>Faça seu cadastro:</span>
          </p>
          <Button text='Cadastrar' onClick={handleSignUpClick} className='cadastrar'></Button>
          </div>
        </div>
        <div style={{width:'40%'}}>imagem</div>
      </div>
      <Dialog title="Login" isOpen={isDialogLoginOpen} onClose={handleCloseLoginDialog}>
        <div>
          <Input
          label='Digite o e-mail'
          type="text"
          name="name"
          placeholder="Email"
          value={loginData.email}
          onChange={handleInputChangeLogin}
          ></Input>
          <Input 
          label='Senha'
          type="password"
          name="passwoed"
          placeholder="senha"
          value={loginData.password}
          onChange={handleInputChangeLogin}
          ></Input>
          <div style={{display: 'flex',justifyContent: 'center'}}>
            <Button text="Continuar" onClick={handleLogin} className='login'/>
          </div>
        </div>
      </Dialog>
      <Dialog title="Cadastro" isOpen={isDialogSignUpOpen} onClose={handleCloseSignUpDialog}>
        <div>
          <Input
          label='nome'
          type="text"
          name="name"
          placeholder="nome"
          value={signUpData.name}
          onChange={handleInputChangeSignUp}
          ></Input>
          <Input
          label='Email'
          type="email"
          name="email"
          placeholder="email"
          value={signUpData.email}
          onChange={handleInputChangeSignUp}
          ></Input>
          <Input 
          label='Senha'
          type="password"
          name="passwoed"
          placeholder="senha"
          value={signUpData.password}
          onChange={handleInputChangeSignUp}
          ></Input>
          <div style={{display: 'flex',justifyContent: 'center'}}>
            <Button text="Continuar" onClick={handleSignUp} className='login'/>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default InitialPage;
