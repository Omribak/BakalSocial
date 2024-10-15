import React, { useEffect, useRef, useState } from 'react';
import { BlueButton } from '../../../GlobalStyles/globalStyles';
import {
  SettingsRadioButtons,
  UserSettingsInputs
} from '../../../Pages/AppPages/SettingsPage/constants';
import { Radio, RadioGroup } from '@mui/material';
import { UpdateFormErrors, UpdateFormValues } from './contants';
import { Update } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import { toast } from 'react-toastify';
import {
  checkAuth,
  UpdateUserInformation
} from '../../../Redux/User/UserSlice';

const UserProfileSection = () => {
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [updateValues, setUpdateValues] = useState<UpdateFormValues>({
    username: '',
    email: '',
    country: '',
    city: ''
  });

  const [updateFormErrors, setUpdateFormErrors] = useState<UpdateFormErrors>(
    {}
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateValues({ ...updateValues, [e.target.name]: e.target.value });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const DeleteAvatar = () => {
    setPreviewImage(
      'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/default-user-profile.png'
    );
    setSelectedFile(null);
  };

  useEffect(() => {
    if (user) {
      setUpdateValues({
        username: user.username || '',
        email: user.email || '',
        country: user.country || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const validate = (values: any): UpdateFormErrors => {
    const errors: UpdateFormErrors = {};
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
    return errors;
  };

  const handleSubmitUpdateForm = async () => {
    // Validate form synchronously
    const errors = validate(updateValues);
    setUpdateFormErrors(errors);
    const formData = new FormData();
    formData.append('username', updateValues.username || '');
    formData.append('email', updateValues.email || '');
    formData.append('country', updateValues.country || '');
    formData.append('city', updateValues.city || '');
    if (selectedFile) {
      formData.append('profilePic', selectedFile);
    }
    if (user) {
      formData.append('userId', user._id);
    }

    // If there are no errors, dispatch the action
    if (Object.keys(errors).length === 0) {
      try {
        const actionResult = await dispatch(UpdateUserInformation(formData));
        if (UpdateUserInformation.fulfilled.match(actionResult)) {
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
      <div className="AvatarHeader">
        <img
          src={previewImage || user?.profilePicture}
          alt="none"
          className="UserProfileImageSettings"
        />
        <div className="AvatarButtons">
          <input
            type="file"
            name="profilePic"
            id="upload-file"
            accept="image/*"
            className="UploadFileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label htmlFor="upload-file">
            <BlueButton className="UploadNewFileBtn" onClick={handleFileClick}>
              Upload New
            </BlueButton>
          </label>
          <button className="DeleteAvatarBtn" onClick={DeleteAvatar}>
            Delete Avatar
          </button>
        </div>
      </div>
      <div className="SettingsFormInputsWrapper">
        {UserSettingsInputs.map((input) => (
          <div className="SettingInputWrapper">
            <p>
              {input.label}{' '}
              {input.required ? (
                <span className="AstrixRequired">*</span>
              ) : null}
            </p>
            <input
              className="SettingsInput"
              {...input}
              onChange={onChange}
              value={updateValues[input.name]}
            />
            <span className="RegErrorMsg">{updateFormErrors[input.name]}</span>
          </div>
        ))}
      </div>
      <div className="SettingsStatusSection">
        <BlueButton
          onClick={handleSubmitUpdateForm}
          className="SettingsSaveChangesBtn"
        >
          Save Changes
        </BlueButton>
      </div>
    </div>
  );
};

export default UserProfileSection;
