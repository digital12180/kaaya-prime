import HttpStatus from 'http-status-codes';
export class ApiError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message = 'Something went wrong', isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
        // Set prototype explicitly
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    // Factory methods for common errors
    static badRequest(message = 'Bad Request', details) {
        return new ApiError(HttpStatus.BAD_REQUEST, message, true, details);
    }
    static requiredfield(message = 'Required Fields Missing', details) {
        return new ApiError(HttpStatus.BAD_REQUEST, message, true, details);
    }
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(HttpStatus.UNAUTHORIZED, message);
    }
    static forbidden(message = 'Forbidden') {
        return new ApiError(HttpStatus.FORBIDDEN, message);
    }
    static notFound(message = 'Not Found') {
        return new ApiError(HttpStatus.NOT_FOUND, message);
    }
    static conflict(message = 'Conflict', details) {
        return new ApiError(HttpStatus.CONFLICT, message, true, details);
    }
    static validationError(message = 'Validation Error', details) {
        return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, true, details);
    }
    static serverError(message = 'Internal Server Error') {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, false);
    }
    static databaseError(message = 'Database Error') {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, false);
    }
    static serviceUnavailable(message = 'Service Unavailable') {
        return new ApiError(HttpStatus.SERVICE_UNAVAILABLE, message, true);
    }
    static tooManyRequests(message = 'Too Many Requests') {
        return new ApiError(HttpStatus.TOO_MANY_REQUESTS, message);
    }
    // Check if error is operational (expected) vs programming error
    static isOperationalError(error) {
        if (error instanceof ApiError) {
            return error.isOperational;
        }
        return false;
    }
    // Convert to JSON response
    toJSON() {
        return {
            success: false,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: new Date().toISOString(),
            ...(this.details && { details: this.details }),
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
        };
    }
    // Log error
    logError() {
        console.error(`[${new Date().toISOString()}] ${this.constructor.name}:`, {
            message: this.message,
            statusCode: this.statusCode,
            isOperational: this.isOperational,
            stack: this.stack,
            details: this.details
        });
    }
}
//# sourceMappingURL=apiError.js.map