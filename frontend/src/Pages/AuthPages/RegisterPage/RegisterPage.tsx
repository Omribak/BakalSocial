import React, { useState } from 'react';
import './RegisterPage.css';
import {
  BlueButton,
  PageContainer,
  RegisterFormInput,
  TitleAuthPage
} from '../../../GlobalStyles/globalStyles';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Radio, RadioGroup } from '@mui/material';
import { FormErrors, inputs, RegValues } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../../../Redux/User/UserSlice';
import { AppDispatch, RootState } from '../../../Redux/store';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [regValues, setRegValues] = useState<RegValues>({
    username: '',
    email: '',
    password: '',
    country: '',
    city: '',
    birthday: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(
    (state: RootState) => state.UserReducer.isLoading
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegValues({ ...regValues, [e.target.name]: e.target.value });
  };

  const validate = (values: RegValues): FormErrors => {
    const errors: FormErrors = {};
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!values.username) {
      errors.username = 'Username is required.';
    } else if (values.username.length < 3 || values.username.length > 20) {
      errors.username = 'Username must be 3-20 characters.';
    }
    if (!values.email) {
      errors.email = 'Email is required.';
    } else if (!EmailRegex.test(values.email)) {
      errors.email = 'Email format is not valid.';
    }
    if (!values.password) {
      errors.password = 'Password is required.';
    } else if (values.password.length < 6) {
      errors.password = 'Password must have at least 6 digits.';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form synchronously
    const errors = validate(regValues);
    setFormErrors(errors);

    // If there are no errors, dispatch the action
    if (Object.keys(errors).length === 0) {
      try {
        const actionResult = await dispatch(RegisterUser(regValues));

        if (RegisterUser.fulfilled.match(actionResult)) {
          // Handle fulfilled action (i.e., registration successful)
          const data = actionResult.payload as any;
          toast.success(`${data.message}`);
          navigate('/login');
        } else {
          // Handle rejected action (i.e., registration failed)
          const errorMessage = actionResult.payload as string; // Ensure payload is the error message
          toast.error(errorMessage);
        }
      } catch (error) {
        // Handle unexpected errors
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <PageContainer>
      <div className="registerWrapper">
        <div className="LeftSide">
          <TitleAuthPage className="TitlePage">Join BakalSocial</TitleAuthPage>
          <h2 className="DescriptionPage">
            Create a new account and join the social family, sharing your ideas
            and life.
          </h2>
        </div>
        <div className="RightSide">
          <form className="registerForm" onSubmit={handleSubmit}>
            {inputs.map((input) => (
              <div className="InputAndError" key={input.id}>
                <RegisterFormInput
                  {...input}
                  value={regValues[input.name]}
                  onChange={onChange}
                />
                <span className="RegErrorMsg">{formErrors[input.name]}</span>
              </div>
            ))}
            <p className="ChooseGenderText">Choose Your Status:</p>
            <RadioGroup>
              <div className="radioButtonsContainer">
                <label>
                  <p>Single</p>
                  <Radio value="single" />
                </label>
                <label>
                  <p>Married</p>
                  <Radio value="married" />
                </label>
                <label>
                  <p>Divorced</p>
                  <Radio value="divorced" />
                </label>
              </div>
            </RadioGroup>
            {isLoading ? (
              <div className="LoaderWrapper">
                <CircularProgress className="Loader" />
              </div>
            ) : (
              <BlueButton className="RegisterButton">Register</BlueButton>
            )}
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default RegisterPage;
