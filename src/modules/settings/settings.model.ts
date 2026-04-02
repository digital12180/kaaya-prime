import mongoose, { Document, Schema } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema<ISetting> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    value: {
      type: Schema.Types.Mixed, // 🔥 flexible
      required: true,
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>(
  "Setting",
  SettingsSchema
);