import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  title: string;
  slug: string;
  region: string;
  growth: string;
  description: string;
  period: string;
  fileSize: string;
  fileType: string;
  imageUrl: string;
  fileUrl: string;
  type: "marketinsights" | "annualreport";
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
      required: true,
      trim: true,
    },

    growth: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    period: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      required: true,
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
      enum: ["marketinsights", "annualreport"],
      required: true,
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