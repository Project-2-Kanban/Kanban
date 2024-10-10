import React from "react";

interface InputProps {
    label?: string;
    value?: string;
    placeholder?: string;
    name?: string;
    id?: string;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    type = "text",
    style,
  }) => {
    style = style ? style : { cursor: "pointer", borderRadius:'10px',border:'solid 1px #2C3E50',height: '16px', padding:'10px', outline:'none'};
    return (
      <div style={{display:'flex',flexDirection: 'column', textAlign:'left', gap:'8px', paddingBottom:'16px'}}>
        <label htmlFor={id}>{label}</label>
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onClick={onClick}
          onChange={onChange}
          style={style}
        />
      </div>
    );
  };
  
  export default Input;