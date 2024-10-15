import styled from 'styled-components';

// Auth Styles - Login/Register Page:

export const FormInput = styled.input`
  padding: 1.2rem;
  outline: none;
  width: 100%;
  max-width: 500px;
`;

export const RegisterFormInput = styled.input`
  padding: 0.5rem;
  outline: none;
  width: 100%;
  max-width: 500px;
`;

export const FormButton = styled.button`
  padding: 1rem;
`;

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
`;

export const TitleAuthPage = styled.h1`
  color: var(--primary-color);
`;

// App Styles

export const AppContainer = styled.div``;

export const ContentContainer = styled.div`
  padding-top: 3.5rem;
`;

export const BlueButton = styled.button`
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.7rem;
  cursor: pointer;
  border-radius: 5px;
`;

export const GreenButton = styled.button`
  background-color: green;
  color: #fff;
  border: none;
  padding: 0.7rem;
  cursor: pointer;
  border-radius: 5px;
`;
