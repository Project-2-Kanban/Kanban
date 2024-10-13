import React from "react";
import Button from "./Button/Button";
import { useUser } from "../context/UserContext";

interface MenuProps {
    style?: React.CSSProperties;
    visibleComponent: string;
    setVisibleComponent: (component: string) => void;
}

const Menu: React.FC<MenuProps> = ({ style, visibleComponent, setVisibleComponent }) => {
    const { user } = useUser();
    if (!user) return null;

    const openMenu = () => {
        // Abrir o menu (pode ser implementado futuramente)
    };

    const home = () => {
        setVisibleComponent("home");
    };

    const members = () => {
        setVisibleComponent("members");
    };

    return (
        <div style={{ height: "100vh", backgroundColor: "#2C3E50", width: "70px" }}>
            <Button
                icon="menu"
                onClick={openMenu}
                className={visibleComponent === "menu" ? "iconSelected" : "icon"}
            />
            <Button
                icon="home"
                onClick={home}
                className={visibleComponent === "home" ? "iconSelected" : "icon"}
            />
            <Button
                icon="group"
                onClick={members}
                className={visibleComponent === "members" ? "iconSelected" : "icon"}
            />
        </div>
    );
};

export default Menu;
