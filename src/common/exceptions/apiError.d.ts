export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    details?: any;
    constructor(statusCode?: number, message?: string, isOperational?: boolean, details?: any);
    static badRequest(message?: string, details?: any): ApiError;
    static requiredfield(message?: string, details?: any): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static conflict(message?: string, details?: any): ApiError;
    static validationError(message?: string, details?: any): ApiError;
    static serverError(message?: string): ApiError;
    static databaseError(message?: string): ApiError;
    static serviceUnavailable(message?: string): ApiError;
    static tooManyRequests(message?: string): ApiError;
    static isOperationalError(error: any): boolean;
    toJSON(): any;
    logError(): void;
}
//# sourceMappingURL=apiError.d.ts.map