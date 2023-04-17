const createError = require('http-errors');
const logger = require('./logger')

const requestLogger = (req, res, next) => {
	const { method, path, body } = req;
	const logMessage = `Request: ${method} ${path} - Body: ${JSON.stringify(body)}`;
	logger.info(logMessage);
	next();
};

const checkAuthentication = (routeStr) => (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect(routeStr);
}

const unknownEndpoint = (req, res, next) => {
	next(createError(404));
}

const errorHandler = (err, req, res, next) => {
	logger.error(err.message)

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (err.name === 'ValidationError') {
		return res.status(400).send({
			error: err.message,
			status: err.status,
		})
	} else if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'invalid token'
		})
	} else if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			error: 'token expired'
		})
	}

	next(err)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	checkAuthentication
}