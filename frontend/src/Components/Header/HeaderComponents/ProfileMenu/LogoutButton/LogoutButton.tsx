import { Logout } from '@mui/icons-material';
import React from 'react';
import { AppDispatch } from '../../../../../Redux/store';
import { useDispatch } from 'react-redux';
import { LogoutUser } from '../../../../../Redux/User/UserSlice';

const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const LogoutApp = async () => {
    await dispatch(LogoutUser());
  };

  return (
    <div className="LogoutButtonWrapper">
      <button className="LogoutBtn" onClick={LogoutApp}>
        <Logout />
        <p className="LinkLabel">Logout</p>
      </button>
    </div>
  );
};

export default LogoutButton;
