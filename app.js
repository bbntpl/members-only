const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet')
const passport = require('passport');

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const postsRouter = require('./routes/publicPostsRouter');

const {
	requestLogger,
	unknownEndpoint,
	errorHandler,
} = require('./utils/middleware');
const { MONGODB_URI } = require('./utils/config');
const initialize = require('./passport-config');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB successfully');
	})
	.catch(err => {
		console.log('Error connecting to MongoDB:', err);
	});

app.use(session({
	secret: 'meoowwwwww',
	resave: false,
	saveUninitialized: true
}));

// performance and security improvement setup
app.use(compression());
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// initialize passport
initialize(passport)

app.use(passport.initialize())
app.use(passport.session())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);
// app.use(tokenExtractor)

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/public-posts', postsRouter);

// catch 404 and forward to error handler
app.use(unknownEndpoint);

// error handler
app.use(errorHandler);

app.listen(3000, () => console.log('app listening on port 3000!'));

module.exports = app;
