import React, { forwardRef } from 'react';
import '../../Header.css';
import { Link } from 'react-router-dom';
import { MenuLinks } from './constants';
import { Logout } from '@mui/icons-material';
import ProfileMenuLinks from './ProfileMenuLinks/ProfileMenuLinks';
import LogoutButton from './LogoutButton/LogoutButton';

// Use forwardRef to forward the ref to the div element
const ProfileMenu = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <div ref={ref} className="ProfileMenuWrapper">
      <ProfileMenuLinks />
      <LogoutButton />
    </div>
  );
});

export default ProfileMenu;
