import mongoose, { Document, Schema } from "mongoose";

export interface IAdminUser extends Document {
  username: string;
  password: string;
  role: "admin" | "editor" | "manager";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema<IAdminUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "editor", "manager"],
      default: "editor",
      index: true,
    },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model<IAdminUser>(
  "AdminUser",
  AdminSchema
);