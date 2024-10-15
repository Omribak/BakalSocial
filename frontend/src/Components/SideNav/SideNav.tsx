import React, { forwardRef } from 'react';
import './SideNav.css';
import { SideNavLinks } from './data-structures';
import { Button } from '@mui/material';
import { BlueButton } from '../../GlobalStyles/globalStyles';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import useResponsiveType from '../../custom-hooks/useResponsiveType';

interface SideNavProps {
  ref?: React.Ref<HTMLDivElement>;
  setDisplayNav?: (display: boolean) => void;
}

const SideNav = forwardRef<HTMLDivElement, SideNavProps>((props, ref) => {
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const { isMobile } = useResponsiveType();
  const { setDisplayNav } = props;

  return (
    <div
      className={isMobile ? 'SideNavWrapperMobile' : 'SideNavWrapper'}
      ref={ref}
    >
      <div className="SideNavItems">
        <Link
          to={`/user-profile/${user?._id}`}
          className="LinkTest"
          onClick={() => setDisplayNav && setDisplayNav(false)}
        >
          <div className="SideNavItem">
            <img
              src={user?.profilePicture}
              alt="none"
              className="SideNavImageIcon"
            />
            {user?.username}
          </div>
        </Link>
        {SideNavLinks.map((item) => (
          <Link
            to={item.link ? item.link : '/'}
            className="LinkTest"
            onClick={() => setDisplayNav && setDisplayNav(false)}
          >
            <div className="SideNavItem">
              <img src={item.icon} alt="none" className="SideNavImageIcon" />
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default SideNav;
