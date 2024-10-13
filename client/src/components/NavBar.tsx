import React from "react";
import { ReactNode } from "react";

interface NavBarProps {
  title: string;
  button: ReactNode;
  style?: React.CSSProperties;
}

const NavBar: React.FC<NavBarProps> = ({ title, button, style }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: '66px', background: '#BDC3C7', alignItems: 'center', padding: '0 40px',... style }}>
      <span>{title}</span>
      {button}
    </div>
  );
};

export default NavBar;
