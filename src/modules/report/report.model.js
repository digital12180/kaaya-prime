import mongoose, { Document, Schema } from "mongoose";
const ReportSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["PUBLISHED", "DRAFT", "ARCHIVED"],
        default: "DRAFT",
        index: true,
    },
}, { timestamps: true });
// 🔥 search index
ReportSchema.index({ title: "text", description: "text" });
export const Report = mongoose.model("Report", ReportSchema);
//# sourceMappingURL=report.model.js.map