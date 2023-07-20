class AppError extends Error {
    constructor(message, statusCode, originError = null, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
        this.originError = originError;
    }   

}


module.exports = AppError

