var express = require('express');
const User = require('../models/user');
var router = express.Router();

router.get('/:id/delete', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:id/delete', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/:id/edit', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:id/edit', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/', async function(req, res, next) {
	if(!req.user) {
		res.redirect('/')
	}

	try {
		const currentUser = req.user;
		const membersCount = await User.countDocuments({ hasMembershipStatus: true })
		const usersCount = await User.countDocuments()
		const users = await User.find({});
		res.render('members', { 
			users,
			currentUser,
			membersCount,
			usersCount
		 });
	} catch(err) {
		next(err);
	}
});

module.exports = router;
