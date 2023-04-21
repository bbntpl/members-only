require('dotenv').config();

module.exports = {
  PORT,
  MONGODB_URI,
	SECRET_KEY,
  SENDGRID_API_KEY,
} = process.env;