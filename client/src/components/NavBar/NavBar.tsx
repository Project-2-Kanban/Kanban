import React from "react";
import { ReactNode } from "react";
import "./NavBar.css";

interface NavBarProps {
  title: string;
  button: ReactNode;
  style?: React.CSSProperties;
}

const NavBar: React.FC<NavBarProps> = ({ title, button, style }) => {
  return (
    <div style={style} className="navbar">
      <div style={{display:'flex', alignItems:'center'}}>  
        <span style={{fontSize:'40px'}} className="material-symbols-outlined">
          raven
        </span>
        <span>{title}</span>
      </div>
      
      {button}
    </div>
  );
};

export default NavBar;
