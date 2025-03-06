import React from 'react';
import { Route,  Navigate, RouteProps } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface PrivateRouteProps extends RouteProps {
  element: React.ReactNode;
}

const PrivateRoute = ({ element, ...rest }: PrivateRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Route
      {...rest} //retrieves props from a normal route and spreads them to privateRoute
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;