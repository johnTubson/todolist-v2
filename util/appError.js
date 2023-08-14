class AppError extends Error {
	constructor(message, statusCode, originError = null, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.originError = originError;
		this.isOperational = isOperational;
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
