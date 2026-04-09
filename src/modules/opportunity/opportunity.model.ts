import mongoose, { Document, Schema } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  slug: string;
  description: string;
  location: string;
  images: string[];
  area: mongoose.Types.ObjectId;
  landingPage: mongoose.Types.ObjectId[],
  status: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
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
    slug: {
      type: String,
      trim: true,
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
    landingPage: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LandingPage',
      default: []
    }],
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
    },
    images:
      [{
        type: String,
        trim: true
      }],
    status: {
      type: String,
      enum: ["ACTIVE", "UPCOMING", "SOLD OUT", "UNDER REVIEW"],
      default: "ACTIVE",
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