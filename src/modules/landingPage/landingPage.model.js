import mongoose, { Document, Schema } from "mongoose";
const LandingPageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    formType: {
        type: String,
        enum: ["CONTACT", "CONSULTATION", "DOWNLOAD", "NONE"],
        default: "NONE",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["PUBLISHED", "DRAFT", "DISABLED"],
        default: "PUBLISHED",
        index: true,
    },
}, { timestamps: true });
// 🔥 search index
LandingPageSchema.index({
    title: "text",
    content: "text",
});
// 🔥 fast lookup
LandingPageSchema.index({ slug: 1, status: 1 });
export const LandingPage = mongoose.model("LandingPage", LandingPageSchema);
//# sourceMappingURL=landingPage.model.js.map