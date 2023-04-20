const User = require('../models/user');

exports.membersView = async function(req, res, next) {
	if(!req.user) {
		res.redirect('/')
	}
	
	try {
		const currentUser = req.user;
		const membersCount = await User.countDocuments({ hasMembershipStatus: true })
		const users = await User.find({});
		res.render('members', { 
			users,
			currentUser,
			membersCount,
		 });
	} catch(err) {
		next(err);
	}
}