import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  title: string;
  slug: string;
  description: string;
  fileUrl: string;
  image: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
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
  },
  { timestamps: true }
);

// 🔥 search index
ReportSchema.index({ title: "text", description: "text" });

export const Report = mongoose.model<IReport>("Report", ReportSchema);