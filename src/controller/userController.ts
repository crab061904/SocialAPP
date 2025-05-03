import { Request, Response, NextFunction } from 'express';
import { getUsers, getUserByEmail, createUser, deleteUserById, updateUserById } from '../queries/userQueries';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const UserController = {

// Get all users
getAllUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await getUsers();  
      console.log("Fetched Users:", users);  
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error(error);
      next(error);  
    }
  },
  

  // Get user by email
  getUserByEmail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.params;
      const user = await getUserByEmail(email);  // Get user by email
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

 // Create a new user
createUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Received request to create user"); // Log that we're hitting this route
    try {
      const { username, email, password, role, avatar, bio } = req.body;
  
      console.log("Request body:", req.body); // Log the request body to check what data is sent
  
      if (!username || !email || !password) {
        res.status(400).json({ success: false, error: 'Missing required fields.' });
        return;
      }
  
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ success: false, error: 'Email already exists.' });
        return;
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      const userData = { username, email, password: hashedPassword, role, avatar, bio };
      
    
  
      const newUser = await createUser(userData);
  

  
      if (!newUser) {
        res.status(500).json({ success: false, error: 'Failed to create user.' });
        return;
      }
  
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      next(error);  // Pass error to the default error handler
    }
  },
  
  
  
  

  // Delete user by ID
  deleteUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedUser = await deleteUserById(id);  // Delete user by ID
      if (!deletedUser) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Update user information
  updateUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      // Check if password is being updated, and if so, hash it
      if (updatedData.password) {
        const salt = bcrypt.genSaltSync(10);
        updatedData.password = bcrypt.hashSync(updatedData.password, salt);
      }

      const updatedUser = await updateUserById(id, updatedData);  // Update user by ID
      if (!updatedUser) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
};
