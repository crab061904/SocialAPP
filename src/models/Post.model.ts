// src/models/Post.model.ts
import mongoose from 'mongoose';

// Post Schema (Post.model.ts)
const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,  // Ensure user is required
  },
  text: {
    type: String,
    required: true,  // Post text is required
  },
  media: [{
    type: String,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Array of User IDs who liked the post
    default: [],
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference Comment model
    ref: 'Comment',  // Reference to the Comment model
  }],
  createdAt: {
    type: Date,
    default: Date.now,  // Set the default creation time
  },
});

export const PostModel = mongoose.model('Post', PostSchema);
