import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Ajuste o caminho conforme necessário

interface PrivateRouteProps {
    element: ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {
    const { user } = useUser();
    return user ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
