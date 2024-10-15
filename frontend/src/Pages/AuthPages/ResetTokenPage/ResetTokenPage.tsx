import React, { useState } from 'react';
import {
  BlueButton,
  FormButton,
  FormInput,
  GreenButton,
  PageContainer
} from '../../../GlobalStyles/globalStyles';
import { Link, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './ResetTokenPage.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../Redux/store';
import { ResetUserPassword } from '../../../Redux/User/UserSlice';
import { toast } from 'react-toastify';

const ResetPasswordSchema = z
  .object({
    newpassword: z.string().min(1, { message: ' Password field is required.' }),
    confirmpassword: z
      .string()
      .min(1, { message: 'Confirm Password field is required.' })
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: 'Passwords must match.',
    path: ['confirmpassword']
  });

const handleBack = (e: React.FormEvent) => {
  e.preventDefault();
};

const ResetTokenPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema)
  });

  const submitResetPassword = async (data: FieldValues) => {
    try {
      console.log(data);
      const formData = {
        password: data.newpassword,
        confirmPassword: data.confirmpassword
      };
      const actionResult = await dispatch(
        ResetUserPassword({ formData, token })
      );
      if (ResetUserPassword.rejected.match(actionResult)) {
        const errorMessage = actionResult.payload as string;
        toast.error(errorMessage);
      } else {
        const data = actionResult.payload as any;
        if (data.status === 'success') {
          toast.success(`${data.message}`);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    }
    reset();
  };

  return (
    <PageContainer>
      <div className="ResetPasswordWrapper">
        <form className="ResetPasswordForm">
          <h1>Reset Password</h1>
          <p>Please enter a new password to recover your account:</p>
          <FormInput
            {...register('newpassword')}
            placeholder="New Password"
            type="password"
            className={errors.newpassword ? 'inputError' : ''}
          />
          {errors.newpassword &&
            typeof errors.newpassword.message === 'string' && (
              <p className="errorMessage">{errors.newpassword.message}</p>
            )}
          <FormInput
            {...register('confirmpassword')}
            placeholder="Confirm Password"
            type="password"
            className={errors.confirmpassword ? 'inputError' : ''}
          />
          {errors.confirmpassword &&
            typeof errors.confirmpassword.message === 'string' && (
              <p className="errorMessage">{errors.confirmpassword.message}</p>
            )}
          <div className="formButtons">
            <BlueButton onClick={handleBack}>
              <Link to="/login">Back</Link>
            </BlueButton>
            <GreenButton
              className={isSubmitting ? 'FormSubmitting' : ''}
              onClick={handleSubmit(submitResetPassword)}
              disabled={isSubmitting}
            >
              Reset Password
            </GreenButton>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default ResetTokenPage;
