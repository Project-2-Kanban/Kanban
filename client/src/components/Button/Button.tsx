import React from "react";
import "./Button.css";

interface ButtonProps {
  text: string;
  onClick: (event: React.MouseEvent) => void;
  styleType?: 'close' | 'secondary';
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, styleType, className, style }) => {
  const buttonClass =
    styleType === 'close' ? 'closeButton' :
      styleType === 'secondary' ? 'secondaryButton' :
        'defaultButton';

  return (
    <button
      className={`${buttonClass} ${className}`}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
