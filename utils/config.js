require('dotenv').config();

const { PORT, SECRET, MONGODB_URI } = process.env;

const ENV_VARS = {
	PORT, 
	SECRET,
	MONGODB_URI,
}

module.exports = ENV_VARS;