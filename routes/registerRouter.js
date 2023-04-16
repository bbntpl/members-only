const express = require('express');

const app = express.Router();

app.get('/', registerController.registerView);

app.post('/', registerConroller.register);

module.exports = app;