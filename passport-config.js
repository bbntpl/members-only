const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initialize(passport) {
	const authenticateUser = async (usernameOrEmail, password, callback) => {
		try {
			// ttempt to find the user by email or username
			const user = await User.findOne({
				$or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
			});

			// verify email or username; otherwise, return an error
			if (!user) {
				return callback(null, false, { message: 'Incorrect email or username.' });
			}

			// verify the entered password
			bcrypt.compare(password, user.hashedPassword, function (err, res) {
				if (res) {
					return callback(null, user);
				}

				return callback(null, false, { messages: 'Incorrect Password ' });
			})

		} catch (error) {
			callback(error);
		}
	};

	// setup local strategy
	passport.use(new LocalStrategy(
		// look for the field emailOrUsername instead of username
		{ usernameField: 'emailOrUsername' },
		authenticateUser
	));
	passport.serializeUser((user, callback) => callback(null, user.id));
	passport.deserializeUser(async (id, callback) => {
		await User.findById(id)
		.then(user => callback(null, user))
		.catch(err => callback(err));
	});
}

module.exports = initialize;