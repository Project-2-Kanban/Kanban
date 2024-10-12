import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Button from '../components/Button/Button';
import UserMenu from '../components/UserMenu';
import Dialog from '../components/Dialog';
import Input from '../components/Input';
import { useUser } from '../context/UserContext';

const MainPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleAddClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setName("");
    setIsDialogOpen(false);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleMenu();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleConfirmClick = (event: React.MouseEvent) => {
    //+criar um novo card de board (criar um novo compinente ...)
    console.log("criar");
  }

  return (
    <div onClick={() => setIsMenuOpen(false)}>
      <NavBar
        title='Logo'
        button={
          <Button
            text={user?.initials || ''}
            onClick={handleButtonClick}
            className='userIcon'
            style={{ backgroundColor: user?.userColor }}
          />
        }
      />
      {isMenuOpen && user && (
        <UserMenu
          name={user.name}
          email={user.email}
          initials={user.initials}
        />
      )}
      <div style={{ height: 'calc(100vh - 66px)', backgroundColor: '#2C3E50' }}>
        <div style={{padding:'20px'}}>
          <Button
            text={'+'}
            onClick={handleAddClick}
            className='creatBoard'
          />

          <Dialog title="Criar quadro" isOpen={isDialogOpen} onClose={handleCloseDialog}>
            <div>
              <Input
                label='Titulo do Quadro'
                type="text"
                name="quadro"
                placeholder="quadro"
                value={name}
                onChange={handleNameChange}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button text="Continuar" onClick={handleConfirmClick} className='login' />
              </div>
            </div>
          </Dialog>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
