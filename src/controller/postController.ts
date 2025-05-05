import { Request, Response, NextFunction } from 'express';
import { PostModel } from '../models/Post.model';
import { IUser } from '../models/User.model';
import { Types } from 'mongoose';

// Create a new post
const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as Request & { user: IUser }).user;  // Accessing the user from JWT

    // Ensure user is authenticated
    if (!user || !user._id) {
      res.status(403).json({ success: false, error: 'User is not authenticated or user ID is missing' });
      return;
    }

    const { text, media, visibility, tags, relatedCourse } = req.body;  // Destructure from request body

    // Create a new post
    const newPost = new PostModel({
      user: user._id,  // Reference the user's _id
      text,
      media,
      visibility,
      tags,
      relatedCourse,  // Ensure relatedCourse is passed from the request body
    });

    // Save the new post
    await newPost.save();

    // Respond with the created post data
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    next(error);  // Pass error to global handler
  }
};

// Update an existing post
const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, media, visibility, tags, relatedCourse } = req.body;
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

    // Update post fields
    post.text = text || post.text;
    post.media = media || post.media;
    post.visibility = visibility || post.visibility;
    post.tags = tags || post.tags;
    post.relatedCourse = relatedCourse || post.relatedCourse;

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

    // Delete the post
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

// Like a post
const likePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.params;
    const user = (req as Request & { user: IUser }).user;

    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }

    const userId = new Types.ObjectId(user._id);
    const userIndex = post.likes.indexOf(userId);

    if (userIndex > -1) {
      // Remove like if already liked
      post.likes.splice(userIndex, 1);
      await post.save();
      res.status(200).json({ success: true, message: 'Like removed', data: post });
    } else {
      // Add like if not liked yet
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ success: true, message: 'Post liked', data: post });
    }
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    next(error);
  }
};

// Export PostController
export const PostController = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  likePost,
};
