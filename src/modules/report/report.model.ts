import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  title: string;
  slug: string;
  region: string;
  growth: string;
  description: string;
  period: string;
  imageUrl: string;
  fileUrl: string;
  type: "marketinsights" | "annualreport"|"all";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
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
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    region: {
      type: String,
      default: "",
      trim: true,
    },

    growth: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      default: "",
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["marketinsights", "annualreport", "all"],
      default: "all",
      index: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "PUBLISHED",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search Index
ReportSchema.index({
  title: "text",
  description: "text",
  region: "text",
});

export const Report = mongoose.model<IReport>(
  "Report",
  ReportSchema
);