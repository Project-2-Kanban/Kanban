import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface PrivateRouteProps {
    element: ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {
    const { user, loading } = useUser();
    if (!loading) {
        return user ? <Component /> : <Navigate to="/" />;
    }
};

export default PrivateRoute;
