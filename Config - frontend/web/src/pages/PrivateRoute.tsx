import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  try {
    const usuarioRaw = localStorage.getItem('user');
    if (!usuarioRaw) return <Navigate to="/" replace />;

    const usuario = JSON.parse(usuarioRaw);
    if (!usuario?.re || !usuario?.nome) return <Navigate to="/" replace />;

    return <>{children}</>;
  } catch {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;