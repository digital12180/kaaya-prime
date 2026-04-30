
import mongoose, { Schema, Document } from "mongoose";

export interface IRentalYield extends Document {
  area: string;
  value: number; // Store as number (e.g., 7.4)
  width: number; // Percentage width for UI (0-100)
  quarter: string; // e.g., "Q1 2026"
  label?: string; // Optional display label
  createdAt: Date;
  updatedAt: Date;
}

const RentalYieldSchema: Schema<IRentalYield> = new Schema(
  {
    area: {
      type: String,
      required: true,
      trim: true,
      unique: false, // Will be unique with quarter
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    width: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    quarter: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      default: "Average Rental Yield by Zone",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to allow same area in different quarters
RentalYieldSchema.index({ area: 1, quarter: 1 }, { unique: true });
RentalYieldSchema.index({ quarter: 1 });

export const RentalYield = mongoose.model<IRentalYield>("RentalYield", RentalYieldSchema);