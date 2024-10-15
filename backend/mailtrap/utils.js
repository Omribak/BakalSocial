const { sender, mailtrapClient } = require('./mailtrap');
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE
} = require('./templates');

const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  const recipients2 = [
    {
      email: 'omribak2@gmail.com'
    }
  ];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients2,
      subject: 'Reset Your Password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
      category: 'Password Reset'
    });
  } catch (err) {
    console.error('Error sending password reset email', err);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset'
    });
  } catch (err) {
    console.error('Error sending password reset email', err);
  }
};

module.exports = { sendPasswordResetEmail, sendResetSuccessEmail };
