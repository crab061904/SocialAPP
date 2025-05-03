// src/routes/user.routes.ts
import express from 'express';
import { UserController } from '../controller/userController';  // Import controller from the correct path

const router = express.Router();

// Routes for user management
router.get('/', UserController.getAllUsers);              // Get all users
router.get('/:email', UserController.getUserByEmail);    // Get user by email
router.post('/', UserController.createUser);             // Create a new user
router.delete('/:id', UserController.deleteUser);        // Delete user by ID
router.put('/:id', UserController.updateUser);           // Update user by ID

export default router;
