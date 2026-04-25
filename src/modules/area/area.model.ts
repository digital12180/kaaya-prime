import mongoose, { Document, Schema } from "mongoose";

export interface IArea extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  metaTitle?: string;
  opportunities: mongoose.Types.ObjectId[],
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AreaSchema: Schema<IArea> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 search optimization
    },

    slug: {
      type: String,
      required: true,
      unique: true, // 🔥 SEO URL unique
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
    opportunities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        default:[]
      },
    ],
    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },
  
    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// 🔥 TEXT INDEX (for search pages)
AreaSchema.index({
  name: "text",
  content: "text",
  metaTitle: "text",
  metaDescription: "text",
});

AreaSchema.index({opportunities:1});

// 🔥 COMPOUND INDEX (for fast lookup)
AreaSchema.index({ slug: 1, createdAt: -1 });
AreaSchema.pre("validate", function () { //auto slug generate
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});
AreaSchema.index({ createdAt: -1 });
AreaSchema.index({ city: 1 });
AreaSchema.index({ name: "text", city: "text" });
export const Area = mongoose.model<IArea>("Area", AreaSchema);