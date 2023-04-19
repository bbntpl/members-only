const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');
const Passcode = require('../models/passcode');
const { sendPasscodeToEmail } = require('../services/emailService');
const { timeSince } = require('../utils/helper');

exports.passcodeValidation = [
	body('code')
		.notEmpty()
		.withMessage('Code is required')
		.isNumeric()
		.withMessage('Code must be a number'),
];

exports.sendPasscode = async (req, res) => {
	console.log(req.user)
	try {
		if (!req.isAuthenticated()) {
			return res.status(405).json({
				message: 'Unauthenticated user is not allowed to verify membership status'
			});
		}

		const sendCode = async () => {
			const user = req.user;
			await sendPasscodeToEmail(user);
			res.status(200).json({
				message: 'Passcode sent to email'
			});
		}

		const passcode = await Passcode.findOne({
			userId: req.user._id
		})

		// replace the existing passcode so that the expiration resets
		if (passcode) {
			await passcode.deleteOne();
			return await sendCode();
		}
		return await sendCode();
	} catch (error) {
		console.error('Error sending passcode:', error.message);
		res.status(500).json({
			message: 'Error sending passcode',
			error: error.message
		});
	}
}

exports.verifyPasscode = async (req, res, next) => {
	const errors = validationResult(req);
	try {
		const passcode = await Passcode.findOne({
			passcode: req.body.code,
			userId: req.user._id
		});

		if (!passcode || !errors.isEmpty()) {
			const updatedErrors = passcode
				? errors.array()
				: [
					...errors.array(),
					{ msg: 'The code does not match or it has expired' }
				];
			return res.status(400).json({ errors: updatedErrors });
		}

		await User.findByIdAndUpdate(req.user._id, { hasMembershipStatus: true })
		console.log('hasMembershipStatus updated to true');

		return res.status(200).json({
			message: 'Passcode sent to email'
		})
	} catch (err) {
		next(err);
	}
}

exports.postUpdateView = (req, res) => {
	res.send('GET - Post Update View')
}

exports.postUpdate = (req, res) => {
	res.send('POST - Post Update')
}

exports.postDeleteView = (req, res) => {
	res.send('GET - Post Delete View')
}

exports.postDelete = (req, res) => {
	res.send('POST - Post Delete')
}

exports.postDetailView = (req, res) => {
	res.send('GET - Post Detail View')
}

exports.publicPostsView = async (req, res, next) => {
	try {
		const users = await User.find({});
		const posts = await Post.find({});
		res.render('public-posts', {
			currentUser: req.user,
			posts,
			users,
			timeSince
		});
	} catch (err) {
		return next(err)
	}
}

exports.postCreate = (req, res) => {
	res.send('GET - Post Create')
}