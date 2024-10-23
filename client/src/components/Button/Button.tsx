import React from "react";
import "./Button.css";

interface ButtonProps {
  text?: string;
  icon?: string;
  onClick?: (event: React.MouseEvent) => void;
  styleType?: 'close' | 'secondary';
  className?: string;
  style?: React.CSSProperties;
  type?: string
  size?:string;
  color?:string;
}

const Button: React.FC<ButtonProps> = ({ text, icon, onClick, styleType, className, style, size, color }) => {
  const buttonClass =
    styleType === 'close' ? 'closeButton' :
        'defaultButton';

  return (
    <button
      className={`${buttonClass} ${className}`}
      style={style}
      onClick={onClick}
    >
      {icon && <span className="material-symbols-outlined" style={{fontSize:`${size}`, color:`${color}`}}>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default Button;
