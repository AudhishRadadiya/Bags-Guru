import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoutes({ children }) {
  const UserPreferences = localStorage.getItem('UserPreferences');
  const token = JSON.parse(UserPreferences)?.token;

  if (token) {
    return <Navigate to="/parties" replace={true} />;
  } else {
    return <div>{children}</div>;
  }
}

export default PublicRoutes;
