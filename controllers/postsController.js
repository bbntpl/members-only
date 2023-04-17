const { body, validationResult } = require('express-validator')

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

exports.publicPostsView = (req, res) => {
	res.send('GET - Public Posts View')
}

exports.postCreate = (req, res) => {
	res.send('GET - Post Create')
}