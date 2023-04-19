const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.loginView = (req, res) => {
	const redirectUrl = req.query.redirectUrl || '/';
	res.render('login', { redirectUrl, errors: null });
}

exports.validateLogin = [
	body('emailOrUsername')
		.trim()
		.notEmpty()
		.withMessage('Email or username is required'),
	body('password')
		.notEmpty()
		.withMessage('Password is required'),
]

exports.login = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.render('login', {
			emailOrUsername: req.body.emailOrUsername,
			password: req.body.password,
			errors: errors.array()
		})
	}

	passport.authenticate('local', (err, user, info) => {
		console.log(err, user, info);
		if (err) return next(err);

		if (!user) {
			return res.render('login', {
				emailOrUsername: req.body.emailOrUsername,
				password: req.body.password,
				errors: [...errors.array(), {
					msg: info.messages
				}],
			});
		}

		req.logIn(user, (err) => {
			if (err) return next(err);
			// after successful login
			const redirectUrl = req.body.redirectUrl || '/'
			res.redirect(redirectUrl);
		});
	})(req, res, next);
};