// src/models/insight.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  type: "market" | "location" | "developer";
  entity?: string;
  metric_key: string;
  metric_label: string;
  value: number;
  unit: string;
  period?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    type: {
      type: String,
      enum: ["market", "location", "developer"],
      required: true,
    },
    entity: {
      type: String,
      trim: true,
      required: function(this: IInsight) {
        return this.type !== "market";
      },
    },
    metric_key: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    metric_label: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
      match: /^Q[1-4]\s\d{4}$/, // Q1 2024 format
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
InsightSchema.index({ type: 1, period: 1 });
InsightSchema.index({ entity: 1, type: 1 });
InsightSchema.index({ metric_key: 1, period: 1 });
InsightSchema.index({ type: 1, entity: 1, metric_key: 1 }, { unique: true });

export const Insight = mongoose.model<IInsight>("Insight", InsightSchema);