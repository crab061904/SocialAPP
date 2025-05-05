// src/controller/postController.ts
import { Request, Response, NextFunction } from 'express';
import { PostModel } from '../models/Post.model';
import { IUser } from '../models/User.model';
import { Types } from 'mongoose';
// Create a new post
const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as Request & { user: IUser }).user;  // Accessing the user from the JWT

    // Check if user exists (should be attached via JWT middleware)
    if (!user || !user._id) {
      res.status(403).json({ success: false, error: 'User is not authenticated or user ID is missing' });
      return;
    }

    const { text, media } = req.body;  // Extract post content from request body

    // Log the user info to ensure it's being passed correctly
    console.log('User info:', user);

    // Create a new post and assign the user's _id to the 'user' field
    const newPost = new PostModel({
      user: user._id,  // Correctly reference the user's _id here
      text,
      media,
    });

    // Save the new post
    await newPost.save();

    // Respond with the newly created post
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    next(error);  // Pass error to global error handler
  }
};


// Update a post
const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, media } = req.body;
    const user = (req as Request & { user: IUser }).user;

    const post = await PostModel.findById(id);
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }

    if (post.user.toString() !== user._id.toString()) {
      res.status(403).json({ success: false, error: 'Unauthorized to update this post' });
      return;
    }

    post.text = text || post.text;
    post.media = media || post.media;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating post:', error);
    next(error);
  }
};

// Delete a post
const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as Request & { user: IUser }).user;

    const post = await PostModel.findById(id);
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }

    if (post.user.toString() !== user._id.toString()) {
      res.status(403).json({ success: false, error: 'Unauthorized to delete this post' });
      return;
    }

    // Replacing .remove() with findByIdAndDelete
    await PostModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    next(error);
  }
};

// Get all posts
const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await PostModel.find().populate('user');
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
};
const likePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.params;  // Get the post ID from the URL params
    const user = (req as Request & { user: IUser }).user;  // Get the logged-in user from JWT

    // Add these console logs to debug the issue
    console.log("Liking post with ID:", postId);
    console.log("User ID from JWT:", user._id);

    // Find the post
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }

    const userId = new Types.ObjectId(user._id);  // Convert user._id to ObjectId
    const userIndex = post.likes.indexOf(userId);  // Search for the user's ObjectId in the likes array

    if (userIndex > -1) {
      // If the user already liked the post, remove their like
      post.likes.splice(userIndex, 1);
      await post.save();
      res.status(200).json({ success: true, message: 'Like removed', data: post });
    } else {
      // If the user hasn't liked the post, add their like
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ success: true, message: 'Post liked', data: post });
    }
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    next(error);  // Pass error to global error handler
  }
};


// Export PostController object (named export)
export const PostController = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  likePost,
};
