import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  price: string;
  status: "For Rent" | "For Buy";
  type: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  location: string;
  description: string;
  imageUrl: string;
  images: string[];
  specs: {
    label: string;
    value: string;
  }[];
  amenities: string[];
  floorPlanUrl: string;
  videoUrl?: string;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },

    price: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["For Rent", "For Buy"],
      required: true,
      default: "For Rent",
    },

    type: {
      type: String,
      enum: ["Apartment", "House", "Condo", "Villa", "Townhouse"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    specs: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    floorPlanUrl: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search Index
PropertySchema.index({
  title: "text",
  location: "text",
  description: "text",
});

// Filter Index
PropertySchema.index({
  status: 1,
  type: 1,
  location: 1,
  createdAt: -1,
});

const Property = mongoose.model<IProperty>(
  "PropertyDetail",
  PropertySchema
);

export default Property;