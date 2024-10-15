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
      <span>{title}</span>
      {button}
    </div>
  );
};

export default NavBar;
