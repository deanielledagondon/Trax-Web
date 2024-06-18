import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return session ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
