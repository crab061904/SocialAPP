import mongoose from 'mongoose';
import slugify from 'slugify';

// Define the schema
const StoriesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Type_Of_Story: {
    type: String,
    enum: ['image', 'text'],
  },
  text: {
    type: String,
  },
  textStyle: {
    fontSize: {
      type: Number,
      default: 14,
    },
    position: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
    },
    background: {
      type: String,
      default: 'bg-gradient-to-tr from-blue-400 to-purple-500',
    },
  },
  media: [
    {
      type: String,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [], // Array of user IDs who liked the story
    },
  ],
  visibility: {
    type: String,
    enum: ['public', 'department', 'org'],
    default: 'public',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours from creation
  },
  slug: {
    type: String,
    unique: true,
    set: (value: string): string => slugify(value, { lower: true, strict: true }), // Set the value type as string
  },
});

module.exports = mongoose.model('Story', StoriesSchema);
