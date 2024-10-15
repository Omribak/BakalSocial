import React from 'react';
import { MenuLinks } from '../constants';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../Redux/store';

const ProfileMenuLinks = () => {
  const { user } = useSelector((state: RootState) => state.UserReducer);
  return (
    <>
      {MenuLinks.map((menulink) => (
        <div className="ProfileLinkWrapper">
          <Link
            to={
              menulink.label === 'Profile'
                ? menulink.link + `/${user?._id}`
                : menulink.link
            }
            className="ProfileMenuLink"
          >
            <div className="ProfileLinkIcon">
              <menulink.icon className="ProfileItemIcon" />
            </div>
            <p className="LinkLabel">{menulink.label}</p>
          </Link>
        </div>
      ))}
    </>
  );
};

export default ProfileMenuLinks;
