import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    message?: string;
    source?: string;
    page?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true, // 🔥 search optimization
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true, // 🔥 filter by email
        },
        phone: {
            type: String,
            required: true,
            index: true, // 🔥 search/filter
        },
        message: {
            type: String,
            default: "",
        },
        source: {
            type: String,
            default: "website",
            index: true, // 🔥 analytics filtering
        },
        page: {
            type: String,
            default: "",
            index: true, // 🔥 landing page tracking
        },
    },
    {
        timestamps: true, // 🔥 auto createdAt & updatedAt
    }
);

// 🔥 COMPOUND INDEX (VERY IMPORTANT FOR PERFORMANCE)
LeadSchema.index({ email: 1, phone: 1 }, { unique: true });

// 🔥 TEXT INDEX (for search functionality)
LeadSchema.index({
    name: "text",
    email: "text",
    phone: "text",
});

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);