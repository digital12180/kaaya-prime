// src/models/developer-score.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IDeveloperScore extends Document {
  developer: string;
  score: number; // Score from 0-100
  dashOffset: number; // Offset for SVG gauge (calculated as 100 - score or based on design)
  type: string; // "developer-gauges"
  label: string;
  quarter?: string; // Optional quarter for tracking over time
  createdAt: Date;
  updatedAt: Date;
}

const DeveloperScoreSchema: Schema<IDeveloperScore> = new Schema(
  {
    developer: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    dashOffset: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    type: {
      type: String,
      default: "developer-gauges",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    quarter: {
      type: String,
      trim: true,
      match: /^Q[1-4]\s\d{4}$/,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique developer per quarter
DeveloperScoreSchema.index({ developer: 1, quarter: 1 }, { unique: true });
DeveloperScoreSchema.index({ score: -1 });
DeveloperScoreSchema.index({ quarter: 1 });

// Pre-save middleware to auto-calculate dashOffset if not provided
DeveloperScoreSchema.pre('save', function(next) {
  if (!this.dashOffset && this.score) {
    // dashOffset = 100 - score (common for gauge charts)
    this.dashOffset = 100 - this.score;
  }
});

export const DeveloperScore = mongoose.model<IDeveloperScore>("DeveloperScore", DeveloperScoreSchema);