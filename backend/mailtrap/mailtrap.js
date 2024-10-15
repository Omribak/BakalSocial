const { MailtrapClient } = require('mailtrap');
const dotenv = require('dotenv');

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

const mailtrapClient = new MailtrapClient({
  token: TOKEN
});

const sender = {
  email: 'hello@demodomain.com',
  name: 'Bakalsocial Co.'
};
module.exports = { mailtrapClient, sender };
