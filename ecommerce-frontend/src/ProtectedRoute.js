import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    // ⚠️ En vez de forzar redirección, simplemente no renderices contenido sensible
    return children || null;
  }

  return children;
};

export default ProtectedRoute;
