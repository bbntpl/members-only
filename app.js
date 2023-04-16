const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet')

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const registerRouter = require('./routes/registerRouter');

const {
	requestLogger,
	tokenExtractor,
	unknownEndpoint,
	errorHandler,
} = require('./utils/middleware');
const { MONGODB_URI } = require('./utils/config');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB successfully');
	})
	.catch(err => {
		console.log('Error connecting to MongoDB:', err);
	});

app.use(compression());
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger)
// app.use(tokenExtractor)

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(unknownEndpoint);

// error handler
app.use(errorHandler);

module.exports = app;
