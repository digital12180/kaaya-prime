import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  title: string;
  description: string;
  fileUrl: string;
  image?: string;
  status: "active" | "inactive";
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
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 search index
ReportSchema.index({ title: "text", description: "text" });

export const Report = mongoose.model<IReport>("Report", ReportSchema);