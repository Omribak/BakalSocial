import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserData } from '../../Redux/User/UserSlice';
import { CircularProgress } from '@mui/material';

interface CheckAuthProps {
  isAuthenticated: boolean;
  user: UserData | null;
  children?: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({
  isAuthenticated,
  user,
  children
}) => {
  const location = useLocation();

  if (
    !isAuthenticated &&
    location.pathname !== '/login' &&
    location.pathname !== '/register' &&
    location.pathname !== '/forgotPassword' &&
    !location.pathname.includes('/reset-token')
  ) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (
    isAuthenticated &&
    (location.pathname === '/login' ||
      location.pathname === '/register' ||
      location.pathname === '/forgotPassword' ||
      location.pathname.includes('/reset-token'))
  ) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default CheckAuth;
