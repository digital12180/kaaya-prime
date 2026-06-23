import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  price: string;
  location: string;
  images: string[];
  bedrooms: string;
  sqft: string;
  bathrooms: number;
  status: "For Rent" | "For Buy";
  type: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new Schema(
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
    price: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 filter by city/location
    },
    bedrooms: {
      type: String,
      required: true,
      trim: true,
    },
    sqft: {
      type: String,
      required: true,
      trim: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    images:
      [{
        type: String,
        trim: true
      }],
    status: {
      type: String,
      enum: ["For Rent", "For Buy"],
      default: "For Rent"
    },
    type: {
      type: String,
      enum: ["Apartment", "House", "Condo", "Villa", "Townhouse"],
    }
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// 🔥 TEXT INDEX (for search)
PropertySchema.index({
  title: "text",
  location: "text",
});

// 🔥 COMPOUND INDEX (for listing + filters)
PropertySchema.index({ status: 1, location: 1, createdAt: -1 });

export const Property = mongoose.model<IProperty>(
  "Property",
  PropertySchema
);