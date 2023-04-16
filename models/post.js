const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
	timestamp: {
		type: mongoose.Schema.Types.Date,
		default: Date.now
	},
	modified: {
		type: mongoose.Schema.Types.Date,
		default: Date.now
	},
	title: {
		type: String,
		min: 3,
		max: 50,
		required: true
	},
	content: { 
		type: String,
		required: true
	}
});

postSchema.set('toJSON', {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

postSchema.pre('updateOne', function(next) {
  this.set({ modified: Date.now() });
  next();
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;