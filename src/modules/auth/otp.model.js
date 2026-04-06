import mongoose, { Schema, Document } from "mongoose";
const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
// 🔥 AUTO DELETE AFTER EXPIRY (VERY IMPORTANT)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const OtpModel = mongoose.model("Otp", otpSchema);
//# sourceMappingURL=otp.model.js.map