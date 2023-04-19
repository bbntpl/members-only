const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const isUniqueUsername = async (value) => {
	const user = await User.findOne({ username: value });
	if (user) {
		// if a user with the given username already exists, throw an error
		throw new Error('Username already in use');
	}
	// otherwise, it validates the input
	return true;
};

const verifyConfirmPassword = (confirmPassword, { req }) => {
	// if a confirmPassword does not match password, throw an error
	if (confirmPassword !== req.body.password) {
		throw new Error('Passwords must match');
	}
	// otherwise, it validates the input
	return true;
}

exports.registerView = (req, res) => {
	const redirectUrl = req.query.redirectUrl || '/';
	res.render('register', {
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		redirectUrl,
		errors: null
	});
}

exports.register = [
	body('email')
		.trim()
		.toLowerCase()
		.isEmail()
		.withMessage('Email is not valid')
		.notEmpty()
		.withMessage('Email address is required'),
	body('username')
		.isLength({ min: 4, max: 20 })
		.withMessage('Username must be between 4 and 20 characters')
		.notEmpty()
		.withMessage('Username address is required')
		.matches(/^[a-zA-Z0-9]+$/)
		.withMessage('Username must contain the following characters: A-Z, a-z, 0-9')
		.custom(isUniqueUsername),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters')
		.notEmpty()
		.withMessage('Password address is required'),
	body('confirmPassword')
		.notEmpty()
		.withMessage('Confirm password is required')
		.custom(verifyConfirmPassword),
	async (req, res, next) => {
		const errors = validationResult(req);
		const redirectUrl = req.body.redirectUrl || '/'
		if (!errors.isEmpty()) {
			return res.render('register', {
				email: req.body.email,
				username: req.body.username,
				password: req.body.password,
				errors: errors.array(),
				redirectUrl
			});
		}

		try {
			const saltRounds = 12;
			const salt = await bcrypt.genSalt(saltRounds);
			const { password } = req.body;
			const hash = await bcrypt.hash(password, salt);

			const user = new User({
				email: req.body.email,
				username: req.body.username,
				hashedPassword: hash,
			});

			await user.save();

			// after successful user registration
			return res.redirect('/login');
		} catch (err) {
			if (err.code === 11000) {
				// dispaly duplicate key error
				res.render('register', {
					email: req.body.email,
					username: req.body.username,
					password: req.body.password,
					errors: [{ msg: 'The email is already in use.' }],
					redirectUrl,
				});
			} else {
				// handle other errors
				next(err);
			}
		}
	}
]