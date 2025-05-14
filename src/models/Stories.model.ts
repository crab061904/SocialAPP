import mongoose from "mongoose";
import slugify from "slugify";

// Define the schema
const StoriesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Type_Of_Story: {
    type: String,
    enum: ["image", "text"],
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
      default: "bg-gradient-to-tr from-blue-400 to-purple-500",
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
      ref: "User",
      default: [],
    },
  ],
  visibility: {
    type: String,
    enum: ["public", "department-only", "followers-only"],
    default: "public",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  },
  slug: {
    type: String,
    unique: true,
    set: (value: string): string =>
      slugify(value, { lower: true, strict: true }),
  },
  views: {
    type: Number,
    default: 0,
  },
});

// ✅ TTL Index for automatic deletion
StoriesSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export the model
export const StoryModel = mongoose.model("Story", StoriesSchema);
