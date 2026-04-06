import { ApiError } from "../exceptions/apiError.js";
export const errorHandler = (err, req, res, next) => {
    console.error("🔥 Global Error:", err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
//# sourceMappingURL=error.middleware.js.map