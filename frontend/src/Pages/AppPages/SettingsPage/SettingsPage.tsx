import React from 'react';
import SideNav from '../../../Components/SideNav/SideNav';
import './SettingsPage.css';
import { Link, Outlet } from 'react-router-dom';
import { SettingsNavLinks } from './constants';
import useResponsiveType from '../../../custom-hooks/useResponsiveType';
const SettingsPage = () => {
  const { isLaptop, isMobile } = useResponsiveType();
  return (
    <div className="SettingsPageWrapper">
      {!isMobile && <SideNav />}
      <div className="SettingsSection">
        <h1>Account Settings</h1>
        <div className="NavFormContainer">
          <div className="SettingsNav">
            {SettingsNavLinks.map((navlink) => (
              <Link to={navlink.link} className="NavLink">
                <div className="test">
                  <navlink.icon />
                  {navlink.label}
                </div>
              </Link>
            ))}
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
