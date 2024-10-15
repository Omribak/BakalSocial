import React from 'react';
import '../../../Pages/AppPages/HomePage/HomePage.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { Link } from 'react-router-dom';

const RightBar = () => {
  const { user, followingUsers, followersUsers, isLoading } = useSelector(
    (state: RootState) => state.UserReducer
  );

  return (
    <div className="RightBarBirthdayWrapper">
      <div className="BirthdayHeader">
        <img
          src="/app-images/global-connection.png"
          alt="none"
          className="ConnectionImg"
        />
        <p className="BirthdayFriendsText">
          Connect to your friends , family around the world.
        </p>
      </div>
      <img
        className="BirthdayImage"
        src="/app-images/birthday-cover-image.jpg"
        alt="Birthday"
      />
      <div className="OnlineFriendsWrapper">
        <div className="FollowingList">
          <h3>Following</h3>
          <div className="FriendsItems">
            {followingUsers.map((friend: any) => (
              <div className="OnlineFriendItem" key={friend.id}>
                <Link to={`/user-profile/${friend._id}`} className="FriendLink">
                  <img
                    className="UserProfileImage"
                    src={friend.profilePicture}
                    alt="Friend"
                  />
                  {friend.username}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="FollowersList">
          <h3>Followers</h3>
          {followersUsers.map((friend: any) => (
            <div className="OnlineFriendItem" key={friend.id}>
              <Link to={`/user-profile/${friend._id}`} className="FriendLink">
                <img
                  className="UserProfileImage"
                  src={friend.profilePicture}
                  alt="Friend"
                />
                {friend.username}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
