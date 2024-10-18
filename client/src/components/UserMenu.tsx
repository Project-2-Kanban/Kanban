import React, { useEffect, useState } from "react";
import Button from "./Button/Button";
import { useUser } from '../context/UserContext';
import Dialog from "./Dialog/Dialog";
import Input from "./Input/Input";

interface UserMenuProps {
    name: string;
    email: string;
    initials: string;
    style?: React.CSSProperties;
}

const UserMenu: React.FC<UserMenuProps> = ({ name, email, initials, style }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const { user, logout } = useUser();
    if (!user) return null;

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
        console.log(isDialogOpen)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    }

    const addUpdate =() => {
        setIsDialogOpen(false);
    }

    return (
        <div id="userMenu" style={{
            display: 'flex', flexDirection: 'column', width: '250px', alignItems: 'flex-start', gap: '8px', padding: '20px', position: 'absolute',
            right: '0', marginRight: '23px', borderRadius: '10px', marginTop: '3px', backgroundColor: '#1E2125', color: '#BDC3C7', ...style
        }}
        onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'default' }}>
                <div className="userIcon" style={{ marginRight: '10px', fontWeight: 'bold', backgroundColor: user.userColor, color: '#000', cursor: 'default' }}>{initials}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold' }}>{name}</span>
                    <span >{email}</span>
                </div>
            </div>
            <Button text="Meus dados" onClick={handleOpenDialog} className="logout" />
            <Button text="Fazer logout" onClick={logout} className='logout' />
            <div style={{ color: 'black' }}>
                <Dialog title="Meus dados" isOpen={isDialogOpen} onClose={handleCloseDialog}>
                    <div>
                        <Input
                            label='Nome:'
                            type="text"
                            name="Nome"
                            placeholder="algo"
                            value={'test'}
                        />
                        <Input
                            label="E-mail:"
                            type="text"
                            name="E-mail"
                            placeholder="algo"
                            value='test'
                        />
                        <Button text="Confirmar" onClick={addUpdate} style={{}} className="" />
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default UserMenu;
