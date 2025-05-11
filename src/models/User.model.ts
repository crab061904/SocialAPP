import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Change this from string to ObjectId
  firstName: string;
  lastName: string;
  backgroundImage: string;             
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  followers: mongoose.Types.ObjectId[]; // Array of ObjectId
  following: mongoose.Types.ObjectId[]; // Array of ObjectId
  role: string;
  department: string[];
  batchYear: number;
  studentId: string;
  orgs: string[];
  createdAt: Date;
}

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  role: {
    type: String,
    enum: ['student', 'professor', 'alumni', 'admin', 'department', 'club', 'event']
  },
  department: [{
    type: String,
    enum: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Mathematics', 'Physics'],
  }],
  batchYear: { type: Number },
  studentId: { type: String },
  orgs: [{
    type: String,
  }],
  createdAt: { type: Date, default: Date.now },
  backgroundImage: [{
    type: String,
    default:[] // Change this line to reflect an array of strings
  }],
});
export const UserModel = mongoose.model<IUser>('User', UserSchema);
