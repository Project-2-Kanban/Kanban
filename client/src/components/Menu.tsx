import React from "react";
import Button from "./Button/Button";
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

interface MenuProps {
    style?: React.CSSProperties;
    visibleComponent: string;
    setVisibleComponent: (component: string) => void;
    showMembersIcon: boolean;
}

const Menu: React.FC<MenuProps> = ({ style, visibleComponent, setVisibleComponent, showMembersIcon }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) return null;


    const home = () => {
        setVisibleComponent("home");
        navigate('/main');
    };

    return (
        <div style={{ height: "100vh", backgroundColor: "#2C3E50", width: "70px" }}>
            <Button
                icon="home"
                onClick={home}
                style={{borderRadius:'100px'}}
                className={visibleComponent === "home" ? "iconSelected" : "icon"}
            />
        </div>
    );
};

export default Menu;
