import React from "react";
import Button from "./Button/Button";

interface NavBarProps {
  title: string; 
  login: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ title, login }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: '66px', background: '#BDC3C7', alignItems: 'center', padding: '0 40px' }}>
      <span>{title}</span>
      <Button text="Entrar" onClick={login} className='login'/>
    </div>
  );
};

export default NavBar;
