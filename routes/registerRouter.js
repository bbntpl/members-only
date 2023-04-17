const express = require('express');
const app = express.Router();

const registerController = require('../controllers/registerController');

app.get('/', registerController.registerView);

app.post('/', registerController.register);

module.exports = app;