import mongoose, { Document, Schema } from "mongoose";

export interface ILandingPage extends Document {
  title: string;
  slug: string;
  content: string;
  formType: "contact" | "consultation" | "download";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageSchema: Schema<ILandingPage> = new Schema(
  {
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
      enum: ["contact", "consultation", "download"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 search index
LandingPageSchema.index({
  title: "text",
  content: "text",
});

// 🔥 fast lookup
LandingPageSchema.index({ slug: 1, status: 1 });

export const LandingPage = mongoose.model<ILandingPage>(
  "LandingPage",
  LandingPageSchema
);