import React, { useEffect, useState } from 'react';
import SideNav from '../../../Components/SideNav/SideNav';
import './ProfilePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import {
  FollowUserAPI,
  GetFollowers,
  GetFollowing,
  getUser,
  UnFollowUserAPI
} from '../../../Redux/User/UserSlice';
import useResponsiveType from '../../../custom-hooks/useResponsiveType';
import { Link, useParams } from 'react-router-dom';
import { BlueButton } from '../../../GlobalStyles/globalStyles';

const ProfilePage = () => {
  const { isLaptop, isMobile } = useResponsiveType();
  const { userId } = useParams();
  const { user, followingUsers, followersUsers } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const [currentUser, setCurrentUser] = useState<any>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const followingCount = currentUser?.following?.length || 0;
  const followersCount = currentUser?.followers?.length || 0;

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId))
        .then((action) => {
          if (action.payload) {
            setCurrentUser(action.payload.userData);
          }
        })
        .catch((err) => console.error(err));

      dispatch(GetFollowing(userId));
      dispatch(GetFollowers(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      const isCurrentlyFollowing = user?.following?.some(
        (followUser: any) => followUser === userId
      );
      setIsFollowing(isCurrentlyFollowing);
    }
  }, [followingUsers, userId, user]);

  const handleFollow = () => {
    if (user?._id) {
      dispatch(FollowUserAPI({ FollowID: userId, userId: user._id }));
    }
  };

  const handleUnfollow = () => {
    if (user?._id) {
      dispatch(UnFollowUserAPI({ FollowID: userId, userId: user._id }));
    }
  };

  return (
    <div className="ProfilePageWrapper">
      {!isMobile && <SideNav />}
      <div className="UserPofileSection">
        <div className="ProfileImagesWrapper">
          <img
            src="/app-images/post-demo1.jpg"
            alt="none"
            className="BackgroundImage"
          />
          <div className="ProfilePictureWrapper">
            <div className="ImageAndUserName">
              <img
                src={currentUser?.profilePicture}
                alt="none"
                className="UserProfilePicture"
              />
              <h1 className="UsernameTitle">{currentUser?.username}</h1>
              {currentUser?.city !== '' && <p>City : {currentUser?.city} </p>}
              {currentUser?.country !== '' && (
                <p>From : {currentUser?.country}</p>
              )}
              {userId !== user?._id && (
                <>
                  {isFollowing ? (
                    <BlueButton onClick={handleUnfollow}>Unfollow</BlueButton>
                  ) : (
                    <BlueButton onClick={handleFollow}>Follow</BlueButton>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="ProfileFriendsWrapper">
          <div className="FollowersSection">
            <h1 className="FollowingTitle">Following {followingCount}</h1>
            <div className="CardWrapper">
              {followingUsers?.map((followUser: any) => (
                <Link
                  to={`/user-profile/${followUser._id}`}
                  key={followUser._id}
                >
                  <div className="FollowingUserCard">
                    <img
                      src={followUser.profilePicture}
                      alt="none"
                      className="FollowUserProfileImage"
                    />
                    <p>{followUser.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="FollowersSection">
            <h1 className="FollowingTitle">Followers {followersCount}</h1>
            <div className="CardWrapper">
              {followersUsers?.map((followUser: any) => (
                <Link
                  to={`/user-profile/${followUser._id}`}
                  key={followUser._id}
                >
                  <div className="FollowingUserCard">
                    <img
                      src={followUser.profilePicture}
                      alt="none"
                      className="FollowUserProfileImage"
                    />
                    <p>{followUser.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
