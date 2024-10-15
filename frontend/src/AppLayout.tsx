import React from 'react';
import Header from './Components/Header/Header';
import SideNav from './Components/SideNav/SideNav';
import { Outlet } from 'react-router-dom';
import {
  AppContainer,
  ContentContainer,
  PageContainer
} from './GlobalStyles/globalStyles';

const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default AppLayout;
