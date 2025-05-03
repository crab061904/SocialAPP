import mongoose, { Document, Schema } from 'mongoose';

// Export the IUser interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  bio: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
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
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['student', 'professor', 'admin'],
    default: 'student',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export const UserModel = mongoose.model<IUser>('User', UserSchema);
