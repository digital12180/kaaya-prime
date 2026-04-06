import mongoose, { Document, Schema } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "editor", "manager"],
        default: "editor",
        index: true,
    },
}, { timestamps: true });
export const User = mongoose.model("User", UserSchema);
//# sourceMappingURL=user.model.js.map