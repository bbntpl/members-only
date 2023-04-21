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
const membersRouter = require('./routes/membersRouter');
const memberRouter = require('./routes/memberRouter');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const logoutRouter = require('./routes/logoutRouter');
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

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGODB_URI)
		console.log(`Connected to MongoDB successfully: ${conn.connection.host}`);

	} catch (err) {
		console.log('Error connecting to MongoDB:', err);
	}
}

app.use(session({
	secret: SECRET_KEY,
	resave: false,
	saveUninitialized: true,
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

// initialize originalUrl default value /
app.locals.originalUrl = '/';

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/members', membersRouter);
app.use('/member', memberRouter);
app.use('/public-posts', postsRouter);

// catch 404 and forward to error handler
app.use(unknownEndpoint);

// error handler
app.use(errorHandler);

// connect to the database before listening
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("listening for requests");
	})
})

module.exports = app;
