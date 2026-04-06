import mongoose, { Document, Schema } from "mongoose";
const SettingsSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    value: {
        type: Schema.Types.Mixed, // 🔥 flexible
        required: true,
    },
}, { timestamps: true });
export const Setting = mongoose.model("Setting", SettingsSchema);
//# sourceMappingURL=settings.model.js.map