import React from "react";
import "./Input.css"

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void; // Nova prop para o evento Enter
  type?: string;
  style?: React.CSSProperties;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  placeholder,
  name,
  id,
  onClick,
  onChange,
  onEnter,
  type = "text",
  style,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };
  return (
    <div className="box">
      <label htmlFor={id}>{label}</label>
      <input
        className="input"
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onClick={onClick}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={style}
      />
    </div>
  );
};

export default Input;