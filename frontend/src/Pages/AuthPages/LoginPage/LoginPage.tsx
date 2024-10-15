import React, { useState } from 'react';
import './LoginPage.css';
import {
  BlueButton,
  FormButton,
  FormInput,
  PageContainer,
  TitleAuthPage
} from '../../../GlobalStyles/globalStyles';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LoginValues } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import { checkAuth, LoginUser } from '../../../Redux/User/UserSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [LogValues, setLogValues] = useState<LoginValues>({
    email: '',
    password: ''
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(
    (state: RootState) => state.UserReducer.isLoading
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogValues({ ...LogValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (LogValues.email && LogValues.password) {
        const actionResult = await dispatch(LoginUser(LogValues));
        if (LoginUser.rejected.match(actionResult)) {
          const errorMessage = actionResult.payload as string;
          toast.error(errorMessage);
        } else {
          const data = actionResult.payload as any;
          if (data.status === 'success') {
            toast.success(`${data.message}`);
            dispatch(checkAuth());
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="loginWrapper">
      <div className="LeftSide">
        <TitleAuthPage>BakalSocial</TitleAuthPage>
        <h2 className="DescriptionPage">
          Connect with friends , family around you on BakalSocial.
        </h2>
      </div>
      <div className="RightSide">
        <form className="loginForm" onSubmit={handleSubmit}>
          <FormInput placeholder="Email" onChange={onChange} name="email" />
          <FormInput
            placeholder="Password"
            onChange={onChange}
            name="password"
            type="password"
          />
          <div className="ButtonsWrapper">
            <BlueButton className="LoginButton">Login</BlueButton>
            <Link to={'/forgotPassword'} className="forgotPassword">
              Forgot your password?
            </Link>
          </div>
          <Link className="NewAccountLink" to={'/register'}>
            Create a New Account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
