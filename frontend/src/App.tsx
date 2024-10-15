import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/AuthPages/LoginPage/LoginPage';
import RegisterPage from './Pages/AuthPages/RegisterPage/RegisterPage';
import ForgotPassword from './Pages/AuthPages/ForgotPasswordPage/ForgotPassword';
import AppLayout from './AppLayout';
import Home from './Pages/AppPages/HomePage/Home';
import ProfilePage from './Pages/AppPages/ProfilePage/ProfilePage';
import CheckAuth from './Components/CheckAuth/CheckAuth';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './Redux/store';
import { checkAuth } from './Redux/User/UserSlice';
import SettingsPage from './Pages/AppPages/SettingsPage/SettingsPage';
import UserProfileSection from './Components/SettingsPage/UserProfileSection/UserProfileSection';
import PasswordSection from './Components/SettingsPage/PasswordSection/PasswordSection';
import MessagesPage from './Pages/AppPages/MessagesPage/MessagesPage';
import ResetTokenPage from './Pages/AuthPages/ResetTokenPage/ResetTokenPage';
import SearchFriendsPage from './Pages/AppPages/SearchFriendsPage/SearchFriendsPage';
import PageNotFound from './Pages/AppPages/PageNotFound/PageNotFound';

const App = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <Routes>
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-token/:token" element={<ResetTokenPage />} />

          {/* App Pages (Protected) */}
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/user-profile/:userId" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />}>
              <Route index element={<UserProfileSection />} />
              <Route path="passwordSettings" element={<PasswordSection />} />
            </Route>
            <Route path="/messages" element={<MessagesPage />} />
            <Route
              path="/search-friends/:friendvalue"
              element={<SearchFriendsPage />}
            />
          </Route>

          {/* Catch All - 404 Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CheckAuth>
    </BrowserRouter>
  );
};

export default App;
