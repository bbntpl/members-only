const mongoose = require('mongoose');

const passcodeSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	passcode: {
		type: Number,
		required: true
	},
	createdAt: {
		type: mongoose.Schema.Types.Date,
		default: Date.now,
	}
})

passcodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
const Passcode = mongoose.model('Passcode', passcodeSchema);

module.exports = Passcode;