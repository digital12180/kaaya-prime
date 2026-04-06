import { AdminService } from "./auth.service.js";
import { ApiResponse } from "../../common/utils/response.js";
import { ApiError } from "../../common/exceptions/apiError.js";
export class AdminController {
    service = new AdminService();
    // register = async (req: Request, res: Response) => {
    //     const user = await this.service.register(req.body);
    //     return ApiResponse.success(
    //         res,
    //         user,
    //         "User registered successfully",
    //         201
    //     );
    // }
    login = async (req, res) => {
        const { user, token } = await this.service.login(req.body);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return ApiResponse.success(res, { user, token }, "Login successful", 200);
    };
    logout = async (req, res, next) => {
        try {
            // Clear refresh token cookie
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            ApiResponse.success(res, null, 'Logout successful');
        }
        catch (error) {
            next(error);
        }
    };
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user?._id || req.tokenData?.userId;
            if (!userId) {
                throw new ApiError(401, 'Authentication required');
            }
            const profile = await this.service.getProfile(userId);
            ApiResponse.success(res, profile, 'Profile retrieved');
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user?._id || req.tokenData?.userId;
            if (!userId) {
                throw new ApiError(401, 'Authentication required');
            }
            const profile = await this.service.updateProfile(userId, req.body);
            ApiResponse.success(res, profile, 'Profile updated');
        }
        catch (error) {
            next(error);
        }
    };
    // ==================== STEP 5: FORGOT PASSWORD ====================
    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await this.service.forgotPassword(email);
            ApiResponse.success(res, result, result.message);
        }
        catch (error) {
            next(error);
        }
    };
    // ==================== STEP 6: RESET PASSWORD ====================
    resetPassword = async (req, res, next) => {
        try {
            const { email, otp, password } = req.body;
            const result = await this.service.resetPassword(email, otp, password);
            ApiResponse.success(res, null, result.message);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=auth.controller.js.map