const express = require('express');
const app = express.Router();

app.get('/', (req, res, next) => {
	req.logout(null, (err) => next(err));
	res.render('logout');
});

module.exports = app;