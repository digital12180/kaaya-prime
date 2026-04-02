import mongoose, { Document, Schema } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  description: string;
  location: string;
  images: string[];
  status: "active" | "inactive" | "sold";
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema: Schema<IOpportunity> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 search optimization
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 filter by city/location
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "sold"],
      default: "active",
      index: true, // 🔥 filtering
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// 🔥 TEXT INDEX (for search)
OpportunitySchema.index({
  title: "text",
  description: "text",
  location: "text",
});

// 🔥 COMPOUND INDEX (for listing + filters)
OpportunitySchema.index({ status: 1, location: 1, createdAt: -1 });

export const Opportunity = mongoose.model<IOpportunity>(
  "Opportunity",
  OpportunitySchema
);