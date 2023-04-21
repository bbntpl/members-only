const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.handleRedirectUrl = (req, res, next) => {
	if(req.method === 'GET') {
		let redirectUrl = req.query.redirectUrl || '/';
		if (redirectUrl === '/register' || redirectUrl === '/register/') {
			redirectUrl = '/';
		}
		req.session.redirectUrl = redirectUrl;
	}
	console.log(`Redirect URL: ${req.session }`);
	next();
}

exports.loginView = (req, res) => {
	res.render('login', {
		redirectUrl: req.session.redirectUrl,
		errors: null
	});
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
			redirectUrl: req.session.redirectUrl,
			errors: errors.array()
		})
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			return res.render('login', {
				emailOrUsername: req.body.emailOrUsername,
				redirectUrl: req.session.redirectUrl,
				password: req.body.password,
				errors: [...errors.array(), {
					msg: info.messages
				}],
			});
		}

		req.logIn(user, (err) => {
			if (err) return next(err);
			// after successful login
			console.log('Redirecting to: ', req.session.redirectUrl);
			res.redirect(req.session.redirectUrl);
		});
	})(req, res, next);
};