const express = require('express');
const app = express.Router();

/* GET home page. */
app.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Amba Gang Clubhouse',
		user: req.user
	});
});

module.exports = app;