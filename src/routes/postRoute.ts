// src/routes/postRoute.ts
import express from 'express';
import { PostController } from '../controller/postController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Other routes for creating, updating, and deleting posts
router.post('/', authenticateJWT, PostController.createPost);
router.put('/:id', authenticateJWT, PostController.updatePost);
router.delete('/:id', authenticateJWT, PostController.deletePost);
router.get('/', PostController.getAllPosts); // Get all posts (no authentication needed)

// Like a post route (make sure it's here and correctly defined)
// router.post('/:postId/like', authenticateJWT, PostController.likePost);
router.post('/:postId/like', authenticateJWT, PostController.likePost);

export default router;