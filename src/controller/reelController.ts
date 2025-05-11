// controller/reelController.ts
import { Request, Response, NextFunction } from "express";
import { ReelModel } from "../models/Reel.model";
import { IUser } from "../models/User.model";
import { Types } from 'mongoose';
// Create a new reel
const createReel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { videoUrl, caption, visibility, tags, relatedCourse } = req.body;
    const user = (req as Request & { user: IUser }).user; // Get logged-in user from JWT

    const newReel = new ReelModel({
      user: user._id,
      videoUrl,
      caption,
      visibility,
      tags,
      relatedCourse,
    });

    console.log("NEW REEL: ", newReel);

    await newReel.save();
    res.status(201).json({ success: true, data: newReel });
  } catch (error) {
    console.error("Error creating reel:", error);
    next(error);
  }
};

// Get all reels
const getAllReels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reels = await ReelModel.find().populate("user");

    res.status(200).json({ success: true, data: reels });
  } catch (error) {
    console.error("Error fetching reels:", error);
    next(error);
  }
};

// Update a reel
const updateReel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { videoUrl, caption, visibility, tags } = req.body;
    const user = (req as Request & { user: IUser }).user;

    const reel = await ReelModel.findById(id);
    if (!reel) {
      res.status(404).json({ success: false, error: "Reel not found" });
      return;
    }

    if (reel.user.toString() !== user._id.toString()) {
      res
        .status(403)
        .json({ success: false, error: "Unauthorized to update this reel" });
      return;
    }

    reel.videoUrl = videoUrl || reel.videoUrl;
    reel.caption = caption || reel.caption;
    reel.visibility = visibility || reel.visibility;
    reel.tags = tags || reel.tags;

    await reel.save();
    res.status(200).json({ success: true, data: reel });
  } catch (error) {
    console.error("Error updating reel:", error);
    next(error);
  }
};

// Delete a reel
const deleteReel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as Request & { user: IUser }).user;

    const reel = await ReelModel.findById(id);
    if (!reel) {
      res.status(404).json({ success: false, error: "Reel not found" });
      return;
    }

    // Ensure the logged-in user is the author or an admin
    if (reel.user.toString() !== user._id.toString()) {
      res
        .status(403)
        .json({ success: false, error: "Unauthorized to delete this reel" });
      return;
    }

    // Use findByIdAndDelete instead of remove
    await ReelModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Reel deleted successfully" });
  } catch (error) {
    console.error("Error deleting reel:", error);
    next(error);
  }
};

// Increment views when a reel is watched
const incrementViews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const reel = await ReelModel.findById(id);
    if (!reel) {
      res.status(404).json({ success: false, error: "Reel not found" });
      return;
    }

    reel.views += 1;
    await reel.save();

    res.status(200).json({ success: true, data: reel });
  } catch (error) {
    console.error("Error incrementing views:", error);
    next(error);
  }
};

const likeReel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;  // Reel ID from the URL parameter
    const user = (req as Request & { user: IUser }).user;  // Access the user from JWT
  
    // Ensure user is authenticated
    if (!user || !user._id) {
      res.status(403).json({ success: false, error: 'User is not authenticated or user ID is missing' });
      return;
    }
  
    // Find the reel by ID
    const reel = await ReelModel.findById(id);
    if (!reel) {
      res.status(404).json({ success: false, error: 'Reel not found' });
      return;
    }
  
    // Convert user._id to ObjectId if necessary
    const userId = new Types.ObjectId(user._id);
  
    // Check if the user has already liked the reel
    const userIndex = reel.likes.indexOf(userId);
    
    if (userIndex > -1) {
      // If the user has already liked the reel, remove their like
      reel.likes.splice(userIndex, 1);
      await reel.save();
      res.status(200).json({ success: true, message: 'Like removed', data: reel });
    } else {
      // If the user has not liked the reel yet, add their like
      reel.likes.push(userId);
      await reel.save();
      res.status(200).json({ success: true, message: 'Reel liked', data: reel });
    }
  } catch (error) {
    console.error('Error liking/unliking reel:', error);
    next(error); // Pass error to global handler
  }
};

// Export ReelController object
export const ReelController = {
  createReel,
  getAllReels,
  updateReel,
  deleteReel,
  incrementViews,
  likeReel,
};
