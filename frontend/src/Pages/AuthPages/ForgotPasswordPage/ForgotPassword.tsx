import React from 'react';
import {
  BlueButton,
  FormButton,
  FormInput,
  GreenButton,
  PageContainer
} from '../../../GlobalStyles/globalStyles';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { ForgotUserPassword } from '../../../Redux/User/UserSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../Redux/store';

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: ' Email field is required.' })
    .email({ message: 'This is not a valid email.' })
});

const handleBack = (e: React.FormEvent) => {
  e.preventDefault();
};

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema)
  });

  const submitForgotPassword = async (data: FieldValues) => {
    try {
      const actionResult = await dispatch(
        ForgotUserPassword({ email: data.email })
      );
      if (ForgotUserPassword.rejected.match(actionResult)) {
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
      <div className="ForgotPasswordWrapper">
        <form className="forgotPasswordForm">
          <h1>Recover your account</h1>
          <p>Please enter your email to recover your account:</p>
          <FormInput
            {...register('email')}
            placeholder="Your Email"
            type="email"
            className={errors.email ? 'inputError' : ''}
          />
          {errors.email && typeof errors.email.message === 'string' && (
            <p className="errorMessage">{errors.email.message}</p>
          )}
          <div className="formButtons">
            <BlueButton onClick={handleBack}>
              <Link to="/login">Back</Link>
            </BlueButton>
            <GreenButton
              className={isSubmitting ? 'FormSubmitting' : ''}
              onClick={handleSubmit(submitForgotPassword)}
              disabled={isSubmitting}
            >
              Recover
            </GreenButton>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default ForgotPassword;
