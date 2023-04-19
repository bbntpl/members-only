const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
	},
	username: {
		type: String,
		unique: true,
		required: true,
		min: 4,
		max: 20,
		match: /^[a-zA-Z0-9]+$/,
	},
  hashedPassword: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 50
  },
	hasMembershipStatus: {
		type: Boolean,
		required: true,
		default: false,
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
	aboutMe: String,
	createdAt: {
		type: mongoose.Schema.Types.Date,
		default: Date.now
	}
})

userSchema.set('toJSON', {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.virtual('fullname').get(function() {
	return `${this.firstName} ${this.lastName}`;
})

const User = mongoose.model('User', userSchema);

module.exports = User;