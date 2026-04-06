import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    status: "PUBLISHED" | "DRAFT";
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true, // 🔥 search optimization
        },

        slug: {
            type: String,
            required: true,
            unique: true, // 🔥 SEO URL unique
            lowercase: true,
            trim: true,
            index: true,
        },

        content: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        metaTitle: {
            type: String,
            trim: true,
            default: "",
        },

        metaDescription: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: ["PUBLISHED", "DRAFT"],
            default: "DRAFT",
            index: true, // 🔥 filter published blogs
        },
    },
    {
        timestamps: true, // createdAt + updatedAt
    }
);

// 🔥 TEXT INDEX for search (important for blog search feature)
BlogSchema.index({
    title: "text",
    content: "text",
    metaTitle: "text",
    metaDescription: "text",
});

// 🔥 COMPOUND INDEX (for filtering + sorting)
BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.pre("validate", function () {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }
});
export const Blog = mongoose.model<IBlog>("Blog", BlogSchema);