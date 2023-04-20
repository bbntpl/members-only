const User = require('../models/user');
const Post = require('../models/post');
const { timeSince } = require('../utils/helper');

exports.isAdmin = (req, res, next
) => {
	// if the user is not authenticated redirect to previous url
	if (!req.user) {
		return res.redirect(req.header('Referer') || '/');
	}

	// the user must be an admin before proceeding
	if (!req.user.isAdmin) {
		return res.redirect(req.header('Referer') || '/');
	}

	next()
}

exports.matchUserHandler = (req, res, next) => {
	// if the user is not authenticated redirect to previous url
	if (!req.user) {
		return res.redirect(req.header('Referer') || '/');
	}

	const isCurrentUser = req.user._id.toString() === req.params.id.toString();

	// if the user id  and the id as params does not match redirect to previous url
	if (!isCurrentUser) {
		return res.redirect(req.header('Referer') || '/')
	}

	next()
}

exports.memberifyView = async (req, res) => {
	const users = await User.find({});
	const user = await User.findById(req.params.id);

	const options = {
		action: user.hasMembershipStatus ? 'downgrade' : 'upgrade',
		updateKeyterm: user.hasMembershipStatus ? 'nothing' : 'potential',
		role: user.hasMembershipStatus ? '"not a Member"' : 'Member',
		bgColor: user.hasMembershipStatus ? 'bg-red-500' : 'bg-accent'
	}
	res.render('user-memberify', {
		currentUser: req.user,
		user,
		users,
		options,
		timeSince
	});
}

exports.memberify = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		await User.findByIdAndUpdate(req.params.id, {
			hasMembershipStatus: !user.hasMembershipStatus
		});
		res.redirect(`/member/${user._id}`);
	} catch (err) {
		next(err);
	}
}

exports.memberView = async (req, res, next) => {
	if (!req.user) {
		res.redirect('/')
	}

	try {
		const { id } = req.params;
		const currentUser = req.user;
		const user = await User.findById(id);
		const users = await User.find({});
		const userPosts = await Post.find({ userId: req.params.id });
		const isCurrentUser = id.toString() === currentUser._id.toString();

		const toggleMembershipStatus = async () => {
			await User.findByIdAndUpdate(req.user._id, { hasMembershipStatus: true })
				.then(updatedUser => {
					res.redirect('/member/' + updatedUser._id);
				})
				.catch(err => next(err));
		}

		res.render('user', {
			user,
			users,
			userPosts,
			currentUser,
			timeSince,
			isCurrentUser,
			toggleMembershipStatus
		});
	} catch (err) {
		next(err)
	}
}

exports.memberDeleteView = async (req, res, next) => {
	const users = await User.find({});
	res.render('user-delete', {
		currentUser: req.user,
		users,
		timeSince
	});
}
exports.memberDelete = async (req, res, next) => {
	await User.findByIdAndDelete(req.user._id)
		.then(() => {
			req.logout(null, (err) => next(err));
			res.redirect('/');
		})
		.catch(err => next(err));
}

exports.memberUpdateView = async (req, res, next) => {
	try {
		const users = await User.find({});
		res.render('user-update', {
			currentUser: req.user,
			users,
			timeSince
		});
	} catch (err) {
		next(err);
	}
}

exports.memberUpdate = async (req, res, next) => {
	try {
		const updatedUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			aboutMe: req.body.aboutMe,
		};

		await User.findByIdAndUpdate(req.user._id, updatedUser, { new: true })
			.then(updatedUser => {
				res.redirect('/member/' + updatedUser._id);
			})
			.catch(err => next(err));
	} catch (err) {
		next(err)
	}
}