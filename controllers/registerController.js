const { body, validationResult } = require('express-validator');

exports.registerView = (req, res) => {
	res.render('register');
}

exports.register = [
	body('email')
		.trim()
		.isEmail()
		.withMessage('Email is not valid')
		.isRequired()
		.withMessage('Email address is required'),
	body('username')
		.isUnique()
		.isLength({ min: 4, max: 20 })
		.withMessage('Username must be between 4 and 20 characters')
		.isRequired()
		.withMessage('Username address is required')
		.matches(/^\S+@\S+\.\S+$/)
		.withMessage('Username must contain the following characters: A-Z, a-z, 0-9'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters')
		.isRequired()
		.withMessage('Password address is required'),
	body('confirmPassword')
		.isLength({ min: 8 })
		.withMessage('Password must match')
	,
	(req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.send({ errors: result.array() });
		}

		return res.send(`Hello, ${req.query.person}!`);
	}
]