import { User } from "../user/user.model.js";
import bcrypt from "bcryptjs";
import type { RegisterDTO, LoginDTO } from "./auth.dto.js";
import { ApiError } from "../../common/exceptions/apiError.js";
import { generateToken } from "../../common/middleware/auth.middleware.js";
import { ERROR_MESSAGES } from "../../common/responses/message.js";
import { SUCCESS_MESSAGES } from "../../common/responses/message.js";
import { emailService } from "../../common/services/email.service.js";
import { OtpModel } from "./otp.model.js";


export class AdminService {
    // async register(data: RegisterDTO) {
    //     try {
    //         const existingUser = await AdminUser.findOne({
    //             username: data.username,
    //         });

    //         if (existingUser) {
    //             throw new ApiError(409, "Username already exists");
    //         }

    //         const hashedPassword = await bcrypt.hash(data.password, 10);

    //         const user = await AdminUser.create({
    //             username: data.username,
    //             password: hashedPassword,
    //             email: data.email,
    //             role: data.role || "editor",
    //         });

    //         return user;
    //     } catch (error) {
    //         throw error instanceof ApiError
    //             ? error
    //             : new ApiError(500, "Failed to register user");
    //     }
    // }

    async login(data: LoginDTO) {
        try {
            const user = await User.findOne({
                username: data.username,
            }).select("-__v -createdAt -updatedAt");

            if (!user) {
                throw new ApiError(401, "Invalid username or password");
            }

            const isMatch = await bcrypt.compare(
                data.password,
                user.password
            );

            if (!isMatch) {
                throw new ApiError(401, "Invalid username or password");
            }

            const { password, ...userObj } = user.toObject()

            const token = await generateToken({
                id: user._id,
                role: user.role,
            });

            return { user: userObj, token };
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(500, "Login failed");
        }
    }

    async getProfile(userId: string): Promise<any> {
        try {
            console.log("🔍 [DEBUG] Getting profile for user ID:", userId);

            const user = await User.findById({ _id: userId }).select("-password -__v");

            if (!user) {
                console.error("❌ User not found for ID:", userId);
                throw new ApiError(404, ERROR_MESSAGES.USER_NOT_FOUND);
            }


            // Return profile without sensitive data
            const profile = {
                _id: user._id.toString(),
                username: user.username,
                role: user.role || 'editor',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            return profile;
        } catch (error: any) {
            console.error("❌ Profile fetch error:", error.message);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch profile');
        }
    }

    async updateProfile(userId: string, updateData: any): Promise<any> {
        try {
            console.log("🔍 [DEBUG] Updating profile for user ID:", userId);
            console.log("📝 Update data:", updateData);

            // Remove sensitive fields
            const { role } = updateData;

            if (!role) {
                throw new ApiError(400, "Updated fields required")
            }

            const user = await User.findByIdAndUpdate({ _id: userId as string });

            if (!user) {
                console.error("❌ User not found for update:", userId);
                throw new ApiError(404, ERROR_MESSAGES.USER_NOT_FOUND);
            }
            user.role = role ?? user.role;
            await user.save();
            return {
                _id: user._id.toString(),
                username: user.username,
                role: user.role,
                message: SUCCESS_MESSAGES.PROFILE_UPDATED,
            };
        } catch (error: any) {
            console.error("❌ Profile update error:", error.message);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to update profile');
        }
    }
    // ==================== STEP 5: FORGOT PASSWORD ====================
    async forgotPassword(email: string) {
        if (typeof email !== "string") {
            throw new ApiError(400, "Email must be string");
        }
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP (you should store in DB or Redis)
        await OtpModel.create({
            email,
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
        });

        await emailService.sendOtpEmail(email, otp, user.username);

        return {
            message: "OTP sent to email",
            otp: otp
        };
    }

    // ==================== STEP 6: RESET PASSWORD ====================
    async resetPassword(email: string, otp: string, newPassword: string) {

        const otpRecord = await OtpModel.findOne({ email, otp });

        if (!otpRecord) {
            throw new ApiError(400, "Invalid OTP");
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new ApiError(400, "OTP expired");
        }

        // ✅ update password
        const hashed = await bcrypt.hash(newPassword, 10);

        await User.updateOne(
            { email },
            { password: hashed }
        );

        // ✅ delete OTP
        await OtpModel.deleteOne({ _id: otpRecord._id });

        return {
            message: "Password reset successful",
        };
    }

}