import React from "react";
import Button from "./Button/Button"; 

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null; 

  return (
    <div style={dialogOverlayStyle}>
      <div style={dialogContentStyle}>
        <div style={dialogHeaderStyle}>
          <h2>{title}</h2>
          <Button onClick={onClose} text="x" className="close" />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const dialogOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const dialogContentStyle: React.CSSProperties = {
  backgroundColor: "#BDC3C7",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "300px",
  width: "100%",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

const dialogHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
}

export default Dialog