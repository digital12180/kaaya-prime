import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: "admin" | "editor" | "manager";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
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

export const User = mongoose.model<IUser>(
  "User",
  UserSchema
);