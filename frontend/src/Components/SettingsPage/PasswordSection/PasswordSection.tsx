import React, { useState } from 'react';
import { BlueButton } from '../../../GlobalStyles/globalStyles';
import {
  PasswordSettingsInputs,
  UserSettingsInputs
} from '../../../Pages/AppPages/SettingsPage/constants';
import { UpdatePassFormErrors, UpdatePasswordValues } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import { UpdateUserPassword } from '../../../Redux/User/UserSlice';
import { toast } from 'react-toastify';

const PasswordSection = () => {
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const dispatch = useDispatch<AppDispatch>();
  const [updatePasswordVal, setUpdatePasswordVal] =
    useState<UpdatePasswordValues>({
      password: '',
      confirmPassword: ''
    });

  const [updateFormErrors, setUpdateFormErrors] =
    useState<UpdatePassFormErrors>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatePasswordVal({
      ...updatePasswordVal,
      [e.target.name]: e.target.value
    });
  };

  const validate = (values: any): UpdatePassFormErrors => {
    const errors: UpdatePassFormErrors = {};
    if (!values.password) {
      errors.password = 'Password is required.';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 digits.';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required.';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords dont match. ';
    }
    return errors;
  };

  const handleSubmitUpdatePasswordForm = async () => {
    // Validate form synchronously
    const errors = validate(updatePasswordVal);
    setUpdateFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const updateValuesWithID = { ...updatePasswordVal, userId: user?._id };
      try {
        const actionResult = await dispatch(
          UpdateUserPassword({
            id: user?._id,
            formData: updateValuesWithID
          })
        );
        if (UpdateUserPassword.fulfilled.match(actionResult)) {
          // Handle fulfilled action (i.e., registration successful)
          const data = actionResult.payload as any;
          toast.success(`${data.message}`);
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
    <div className="SettingsFormContainer">
      <div className="PasswordsFormInputsWrapper">
        {PasswordSettingsInputs.map((input) => (
          <div className="SettingInputWrapper">
            <p>
              {input.label}{' '}
              {input.required ? (
                <span className="AstrixRequired">*</span>
              ) : null}
            </p>
            <input className="SettingsInput" {...input} onChange={onChange} />
            <span className="RegErrorMsg">{updateFormErrors[input.name]}</span>
          </div>
        ))}
      </div>
      <div className="PasswordSaveChangesSection">
        <BlueButton
          className="SettingsSaveChangesBtn"
          onClick={handleSubmitUpdatePasswordForm}
        >
          Save Password
        </BlueButton>
      </div>
    </div>
  );
};

export default PasswordSection;
