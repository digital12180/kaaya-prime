// src/models/stage.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IStageMetric extends Document {
  value: string;
  label: string;
}

export interface IStage extends Document {
  tag: string; // e.g., "01 / 05 — Spatial Intelligence"
  order: number; // 1-5 for sorting
  title: string; // Store as plain text (without JSX)
  titleHtml?: string; // Store HTML version if needed
  body: string;
  metrics?: IStageMetric[];
  isActive: boolean;
  category: "spatial" | "developer" | "market" | "infrastructure" | "advisory";
  createdAt: Date;
  updatedAt: Date;
}

const StageMetricSchema = new Schema<IStageMetric>({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const StageSchema: Schema<IStage> = new Schema(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    titleHtml: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      required: true,
    },
    metrics: {
      type: [StageMetricSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ["spatial", "developer", "market", "infrastructure", "advisory"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
StageSchema.index({ order: 1 });
StageSchema.index({ category: 1 });
StageSchema.index({ isActive: 1 });

export const Stage = mongoose.model<IStage>("Stage", StageSchema);