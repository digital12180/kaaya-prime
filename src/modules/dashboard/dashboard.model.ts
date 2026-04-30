import mongoose, { Schema, Document } from "mongoose";

export interface IMetrics extends Document {
  average_premium_yield?: number;
  developer_coverage?: number;
  investor_nationalities?: number;
  transaction_growth?: number;
  capital_appreciation?: number;
  volume_aed?: number;
  quarter: string; 
  createdAt: Date;
  updatedAt: Date;
}

const MetricsSchema: Schema<IMetrics> = new Schema(
  {
    average_premium_yield: {
      type: Number,
      min: 0,
      default: 0,
    },
    developer_coverage: {
      type: Number,
      min: 0,
      default: 0,
    },
    investor_nationalities: {
      type: Number,
      min: 0,
      default: 0,
    },
    transaction_growth: {
      type: Number, 
      default: 0,
    },
    capital_appreciation: {
      type: Number,
      default: 0,
    },
    volume_aed: {
      type: Number, 
      min: 0,
      required: true,
    },
    quarter: {
      type: String,
      required: true,
      index: true, 
    },
  },
  {
    timestamps: true, 
  }
);

// MetricsSchema.index({ quarter: 1 }, { unique: true });

export const Metrics = mongoose.model<IMetrics>("Metrics", MetricsSchema);