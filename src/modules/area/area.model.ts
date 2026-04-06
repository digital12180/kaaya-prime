import mongoose, { Document, Schema } from "mongoose";

export interface IArea extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AreaSchema: Schema<IArea> = new Schema(
  {
    name: {
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

    description: {
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
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// 🔥 TEXT INDEX (for search pages)
AreaSchema.index({
  name: "text",
  content: "text",
  metaTitle: "text",
  metaDescription: "text",
});

// 🔥 COMPOUND INDEX (for fast lookup)
AreaSchema.index({ slug: 1, createdAt: -1 });
AreaSchema.pre("validate", function () { //auto slug generate
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});
export const Area = mongoose.model<IArea>("Area", AreaSchema);