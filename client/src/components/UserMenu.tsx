import React from "react";
import Button from "./Button/Button";
import { useUser } from '../context/UserContext';

interface UserMenuProps {
    name: string;
    email: string;
    initials: string;
    style?: React.CSSProperties;
}

const UserMenu: React.FC<UserMenuProps> = ({ name, email, initials, style }) => {
    const { user, logout } = useUser();
    if (!user) return null;

    return (
        <div id="userMenu" style={{
            display: 'flex', flexDirection: 'column', width: '250px', alignItems: 'flex-start', gap: '8px', padding: '20px', position: 'absolute',
            right: '0', marginRight: '23px', borderRadius: '10px', marginTop: '3px', backgroundColor: '#1E2125', color: '#BDC3C7', ...style
        }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div className="userIcon" style={{ marginRight: '10px', fontWeight: 'bold', backgroundColor: user.userColor, color: '#000' }}>{initials}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold' }}>{name}</span>
                    <span >{email}</span>
                </div>
            </div>
            <Button text="Fazer logout" onClick={logout} className='logout' />
        </div>
    );
};

export default UserMenu;
