require('dotenv').config();

module.exports = {
  PORT,
  MONGODB_URI,
  SENDGRID_API_KEY,
} = process.env;