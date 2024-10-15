import React, { useRef, useState } from 'react';
import './Header.css';
import {
  Message,
  NotificationAdd,
  Notifications,
  Person,
  Search
} from '@mui/icons-material';
import useResponsiveType from '../../custom-hooks/useResponsiveType';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ProfileMenu from './HeaderComponents/ProfileMenu/ProfileMenu';
import useOutsideClick from '../../custom-hooks/useOutsideClick';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import SideNav from '../SideNav/SideNav';

const Header = () => {
  const { isMobile } = useResponsiveType();
  const [displaySidenavMobile, setDisplaySidenavMobile] = useState(false);
  const [displayProfileMenu, setDisplayProfileMenu] = useState(false);
  const [searchFriendValue, setSearchFriendValue] = useState('');
  const [SearchMobileClicked, setSearchMobileClicked] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.UserReducer);

  const toggleProfileMenu = () => {
    setDisplayProfileMenu(!displayProfileMenu);
  };

  const HandleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFriendValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchFriendValue !== '') {
        navigate(`/search-friends/${searchFriendValue}`);
      }
    }
  };

  const toggleSidenavMobile = () => {
    setDisplaySidenavMobile(!displaySidenavMobile);
  };

  const toggleSearchMobileClicked = () => {
    setSearchMobileClicked(!SearchMobileClicked);
  };

  const ref = useOutsideClick(
    toggleProfileMenu
  ) as React.RefObject<HTMLDivElement>;

  const SidenavMobileRef = useOutsideClick(
    toggleSidenavMobile
  ) as React.RefObject<HTMLDivElement>;

  const searchWrapperRef = useOutsideClick(toggleSearchMobileClicked);

  return (
    <div className="HeaderContainer">
      {SearchMobileClicked && isMobile && (
        <div className="SearchFriendsMobileWrapper" ref={searchWrapperRef}>
          <input
            className="MobileSearchFriendsInput"
            placeholder="Search for friends..."
            value={searchFriendValue}
            onChange={HandleSearchInput}
            onKeyDown={handleKeyPress}
          />
        </div>
      )}
      {/*Left Section */}
      <div className="LeftContainer">
        {!isMobile ? (
          <Link to="/">
            <h1 className="HeaderLogo">BakalSocial</h1>
          </Link>
        ) : (
          <div className="MobileLogoAndHamb">
            <Link to="/">
              <h1 className="MobileHeaderLogo">B.</h1>
            </Link>
            <button onClick={toggleSidenavMobile}>
              <div className="HamburgerMenuMobile">
                <MenuIcon />
              </div>
            </button>
          </div>
        )}
      </div>

      {isMobile && displaySidenavMobile && (
        <SideNav
          ref={SidenavMobileRef}
          setDisplayNav={setDisplaySidenavMobile}
        />
      )}

      {/*Middle Section */}
      <div className="MiddleContainer">
        {!isMobile ? (
          <>
            <input
              placeholder="Search for friends..."
              className="SearchInput"
              onKeyDown={handleKeyPress}
              onChange={HandleSearchInput}
            />
            <Search className="SearchIcon" />
          </>
        ) : (
          <button
            className="MobileSearchBtn"
            onClick={toggleSearchMobileClicked}
          >
            <Search />
          </button>
        )}
      </div>

      {/*Right Section */}
      <div className="RightContainer">
        <div className="HeaderIcons">
          <Link to="/messages">
            <Message className="MessageIcon" />
          </Link>
        </div>
        <div className="UserAvatar">
          <button onClick={toggleProfileMenu}>
            <img
              src={user?.profilePicture}
              alt="none"
              className="HeaderProfileImage"
            />
          </button>
        </div>
        {displayProfileMenu && <ProfileMenu ref={ref} />}
      </div>
    </div>
  );
};

export default Header;
