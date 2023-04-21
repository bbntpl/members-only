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
		return res.status(200).json({
			message: 'Passcode sent to email'
		})
	} catch (err) {
		next(err);
	}
}

exports.postUpdateView = async (req, res, next) => {
  try {
		const users = await User.find({});
    const post = await Post.findById(req.params.id).populate('author');
    res.render('post-update', { 
			currentUser: req.user,
			users,
			post,
			timeSince
		 });
  } catch (err) {
    next(err);
  }
}

exports.postUpdate = async (req, res, next) => {
  const { title, content } = req.body;
  try {
		await Post.findOneAndUpdate({ _id: req.params.id }, { 
			title, 
			content,
		});
    res.redirect(`/public-posts/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

exports.postDeleteView = async (req, res, next) => {
  try {
		const users = await User.find({});
    const post = await Post.findById(req.params.id).populate('author');
    res.render('post-delete', { 
			currentUser: req.user,
			users,
			post,
			timeSince
		 });
  } catch (err) {
    next(err);
  }
}

exports.postDelete = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/public-posts');
  } catch (err) {
    next(err);
  }
}

exports.postDetailView = async (req, res, next) => {
  try {
		const users = await User.find({});
    const post = await Post.findById(req.params.id).populate('author');
    res.render('post-detail', { 
			currentUser: req.user,
			post, 
			users,
			timeSince
		 });
  } catch (err) {
    next(err);
  }
}

exports.publicPostsView = async (req, res, next) => {
	try {
		const users = await User.find({});
		const posts = await Post.find({}).populate('author')
		.sort({ modified: -1, timestamp: -1 });
		res.render('public-posts', {
			currentUser: req.user,
			posts,
			users,
			timeSince,
			originalUrl: req.originalUrl
		});
	} catch (err) {
		return next(err)
	}
}

exports.postCreate = async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const newPost = new Post({
      title,
      content,
      author: req.user._id
    });
    await newPost.save();
    res.redirect('/public-posts');
  } catch (err) {
    next(err);
  }
}