import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  firstName: string; // Added firstName field
  lastName: string; // Added lastName field
  username: string;
  email: string;
  password?: string; // Optional password for OAuth users
  role: string;
  avatar: string;
  bio: string;
  backgroundImage: string; // Added backgroundImage field
  orgs: string[];
  studentId: string;
  batchYear: number;
  department: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true, // Make firstName required
  },
  lastName: {
    type: String,
    required: true, // Make lastName required
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional for OAuth users
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["student", "professor", "admin"],
    default: "student",
  },
  orgs: {
    type: [String],
    default: [""],
    required: false,
  },
  backgroundImage: {
    type: String,
    default: "", // Default is empty, you can store image URL here
  },
  studentId: {
    type: String,
    default: "",
  },
  batchYear: {
    type: Number,
    default: 0,
  },
  department: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
