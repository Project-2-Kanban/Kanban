import React from "react";
import Button from "../Button/Button";
import "./Dialog.css";

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?:string
}

const Dialog: React.FC<DialogProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={"dialogOverlayStyle"}>
      <div className={"dialogContentStyle"}>
        <div className={"dialogHeaderStyle"}>
          <h2>{title}</h2>
          <Button onClick={onClose} text="x" className="close" />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Dialog