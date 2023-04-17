const express = require('express');
const app = express.Router();

const {
	loginView,
	login,
	validateLogin
} = require('../controllers/loginController');

app.get('/', loginView);

app.post('/', validateLogin, login);

module.exports = app;