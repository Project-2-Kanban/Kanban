import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
    initials: string;
    userColor: string;
    id:string;
}

interface UserContextType {
    user: User | null;
    initials: string | null;
    setUser: (user: User | null) => void;
    setInitials: (initials: string | null) => void;
    userInitials: (fullname: string) => string;
    getUserColor: (name: string) => string;
    logout: () => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initials, setInitials] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const userInitials = (name: string | undefined): string => {
        if (!name || typeof name !== 'string') return '';
        const namesArray = name.trim().split(' ');
        const initials = namesArray.map((n) => n.charAt(0).toUpperCase()).join('');
        return initials.toUpperCase();
    };

    const getUserColor = (name: string | undefined): string => {
        if (!name) return '#000'; // Retorna uma cor padrão se o nome for indefinido ou nulo

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };


    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            const userInitialsValue = userInitials(parsedUser.name);
            const userColor = getUserColor(parsedUser.name);

            setUser({
                name: parsedUser.name,
                email: parsedUser.email,
                initials: userInitialsValue,
                userColor: userColor,
                id:parsedUser.id,
            });
            setInitials(userInitialsValue);
        }
        setLoading(false);
    }, []);

    const logout = () => {
        setUser(null);
        setInitials(null);
        localStorage.removeItem('user');
        const url = process.env.REACT_APP_API_URL;

        fetch(`${url}/user/logout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
    };

    return (
        <UserContext.Provider value={{ user, initials, setUser, setInitials, userInitials, logout, getUserColor, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
