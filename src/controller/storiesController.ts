// controller/storyController.ts
import { Request, Response, NextFunction } from "express";
import { StoryModel } from "../models/Stories.model";
import { IUser } from "../models/User.model";
import slugify from "slugify";
import { Types } from "mongoose";
// Create a new story

const createStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { Type_Of_Story, text, media, visibility, textStyle } = req.body;
    const user = (req as Request & { user: IUser }).user; // Get logged-in user from JWT

    // Generate a slug from the text

    const slug = text?.trim()
      ? slugify(text, { lower: true, strict: true })
      : `story-${Date.now()}`;

    const newStory = new StoryModel({
      user: user._id,
      Type_Of_Story,
      text,
      media,
      visibility,
      textStyle,
      slug, // Ensure slug is included in the new story
    });

    console.log("NEW STORY: ", newStory);

    // Save the story to the database
    await newStory.save();
    res.status(201).json({ success: true, data: newStory });
  } catch (error) {
    console.error("Error creating story:", error);
    next(error);
  }
};

// Like or Unlike a story
const likeStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Story ID from the URL parameter
    const user = (req as Request & { user: IUser }).user; // Accessing the user from JWT

    // Ensure user is authenticated
    if (!user || !user._id) {
      res
        .status(403)
        .json({
          success: false,
          error: "User is not authenticated or user ID is missing",
        });
      return;
    }

    // Find the story by ID
    const story = await StoryModel.findById(id);
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }

    // Convert user._id to ObjectId if necessary
    const userId = new Types.ObjectId(user._id);

    // Check if the user has already liked the story
    const userIndex = story.likes.indexOf(userId);

    if (userIndex > -1) {
      // If the user has already liked the story, remove their like
      story.likes.splice(userIndex, 1);
      await story.save();
      res
        .status(200)
        .json({ success: true, message: "Like removed", data: story });
    } else {
      // If the user has not liked the story yet, add their like
      story.likes.push(userId);
      await story.save();
      res
        .status(200)
        .json({ success: true, message: "Story liked", data: story });
    }
  } catch (error) {
    console.error("Error liking/unliking story:", error);
    next(error); // Pass error to global handler
  }
};

// Get all stories
const getAllStories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stories = await StoryModel.find().populate("user");

    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    next(error);
  }
};

// Get a story by its ID
const getStoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const story = await StoryModel.findById(id).populate("user");
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }

    res.status(200).json({ success: true, data: story });
  } catch (error) {
    console.error("Error fetching story by ID:", error);
    next(error);
  }
};

// Get all stories from a specific user
const getAllStoriesFromUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const stories = await StoryModel.find({ user: userId }).populate("user");

    if (!stories.length) {
      res
        .status(404)
        .json({ success: false, error: "No stories found for this user" });
      return;
    }

    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    console.error("Error fetching stories from user:", error);
    next(error);
  }
};

// Delete a story
const deleteStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as Request & { user: IUser }).user;

    const story = await StoryModel.findById(id);
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }

    if (story.user.toString() !== user._id.toString()) {
      res
        .status(403)
        .json({ success: false, error: "Unauthorized to delete this story" });
      return;
    }

    await StoryModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    next(error);
  }
};
const incrementViews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Get the story ID from the URL

    // Find the story by ID
    const story = await StoryModel.findById(id);
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }

    // Increment the views count
    story.views += 1;

    // Save the updated story with the new view count
    await story.save();

    res.status(200).json({ success: true, data: story });
  } catch (error) {
    console.error("Error incrementing views:", error);
    next(error);
  }
};

export const StoryController = {
  createStory,
  getAllStories,
  getStoryById,
  getAllStoriesFromUser,
  deleteStory,
  incrementViews,
  likeStory, // Add like/unlike functionality
};
