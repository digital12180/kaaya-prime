import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICareer extends Document {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  cv: {
    url: string;
    public_id: string;
    altText: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICareerDocument extends ICareer {
  _id: mongoose.Types.ObjectId;
}

const careerSchema = new Schema<ICareer>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    cv: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      altText: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text index for fullName search
careerSchema.index({ fullName: "text" });

export const Career: Model<ICareer> = mongoose.model<ICareer>("Career", careerSchema);