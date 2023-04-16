const createLogger = (logFn) => (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    logFn(...params);
  }
};

const info = createLogger(console.log);
const error = createLogger(console.error);

module.exports = {
	info, error
}