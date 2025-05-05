import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for Notification
export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'like' | 'comment' | 'follow' | 'share';
  reference: {
    type: 'Post' | 'Reel' | 'Comment';
    id: Types.ObjectId;
  };
  seen: boolean;
  createdAt: Date;
}

// Schema Definition
const NotificationSchema: Schema<INotification> = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'share'],
    required: true,
  },
  reference: {
    type: {
      type: String,
      enum: ['Post', 'Reel', 'Comment'],
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
