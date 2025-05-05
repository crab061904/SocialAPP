import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  backgroundImage: string;             // Background or introduction of the user
  username: string;               // Unique identifier (e.g., "juan.delacruz")
  email: string;                  // Unique, validated (e.g., "juan@ateneo.edu")
  password: string;               // Hashed password
  avatar: string;                 // URL to profile image
  bio: string;                    // Short description (e.g., "CS Student | Debater")
  followers: mongoose.Types.ObjectId[]; // Array of User references (followers)
  following: mongoose.Types.ObjectId[]; // Array of User references (following)
  role: string;                   // "student", "professor", "alumni", "admin", "department", "club", "event"
  department: string[];           // Array of departments (Selectable options like role)
  batchYear: number;              // Graduation year (e.g., 2025)
  studentId: string;              // Optional (e.g., "2020-12345")
  orgs: string[];                 // Array of organization names (e.g., ["Debate Club", "CS Society"])
  createdAt: Date;                // Account creation timestamp
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
