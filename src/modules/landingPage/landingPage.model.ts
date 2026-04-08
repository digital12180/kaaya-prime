import mongoose, { Document, Schema } from "mongoose";

export interface ILandingPage extends Document {
  title: string;
  slug: string;
  content: string;
  opportunity: mongoose.Types.ObjectId;
  formType: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
  status: "PUBLISHED" | "DRAFT" | "DISABLED";
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
      enum: ["CONTACT", "CONSULTATION", "DOWNLOAD", "NONE"],
      default: "NONE",
      required: true,
      index: true,
    },
    opportunity:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true
    },
    status: {
      type: String,
      enum: ["PUBLISHED", "DRAFT", "DISABLED"],
      default: "PUBLISHED",
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