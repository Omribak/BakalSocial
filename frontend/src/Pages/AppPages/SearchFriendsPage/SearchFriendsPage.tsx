import React, { useEffect, useState } from 'react';
import './SearchFriendsPage.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../Redux/store';
import { SearchFriends } from '../../../Redux/User/UserSlice';
import { Link, useParams } from 'react-router-dom';
import SideNav from '../../../Components/SideNav/SideNav';
import useResponsiveType from '../../../custom-hooks/useResponsiveType';

const SearchFriendsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { friendvalue } = useParams();
  const [searchUsers, setSearchUsers] = useState<any>([]);
  const [numResults, setNumResults] = useState();
  const { isMobile } = useResponsiveType();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await dispatch(SearchFriends(friendvalue)).unwrap();
        setSearchUsers(response.users);
        setNumResults(response.results);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (friendvalue) {
      fetchSearchResults();
    }
  }, [dispatch, friendvalue]);

  return (
    <div className="SearchFriendsPageWrapper">
      {!isMobile && <SideNav />}
      <div className="SearchContent">
        <h2 className="SearchTitle">{numResults} Users Found</h2>
        {searchUsers && searchUsers.length > 0 ? (
          <div className="ListUsersWrapper">
            {searchUsers.map((user: any) => (
              <div className="UserCard" key={user._id}>
                <Link
                  to={`/user-profile/${user._id}`}
                  className="SearchFriendLink"
                >
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="SearchedUserImg"
                  />
                  <p className="SearchedUserText">{user.username}</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="NoResultsText">No users found</p>
        )}
      </div>
    </div>
  );
};

export default SearchFriendsPage;
