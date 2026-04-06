export class ApiResponse {
    static success(res, data = null, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, message = "Something went wrong", statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
    static created(res, data, message = "Created successfully") {
        return this.success(res, data, message, 201);
    }
    static badRequest(res, message = "Bad Request") {
        return this.error(res, message, 400);
    }
    static unauthorized(res, message = "Unauthorized") {
        return this.error(res, message, 401);
    }
    static notFound(res, message = "Not Found") {
        return this.error(res, message, 404);
    }
}
//# sourceMappingURL=response.js.map