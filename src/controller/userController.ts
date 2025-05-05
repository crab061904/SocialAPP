import { Request, Response, NextFunction } from "express";
import {
  getUsers,
  getUserByEmail,
  createUser,
  deleteUserById,
  updateUserById,
} from "../queries/userQueries";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt";

import { IUser } from "../models/User.model";

export const UserController = {
  // Get all users
  getAllUsers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Hard-code the user retrieval
      const user = (req as Request & { user: any }).user; // Cast `req.user` as `any`
      console.log("User info from JWT:", user); // Access user data from JWT

      const users = await getUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  // Get user by email
  getUserByEmail: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.params;
      const user = (req as Request & { user: any }).user; // Cast `req.user` as `any`
      console.log("User info from JWT:", user); // Access user data from JWT

      const token = req.headers["authorization"]?.split(" ")[1]; // Get token from the Authorization header
      if (token) {
        const decoded = verifyToken(token);
        if (!decoded) {
          res
            .status(401)
            .json({ success: false, error: "Invalid or expired token" });
          return;
        }
      }

      const fetchedUser = await getUserByEmail(email);
      if (!fetchedUser) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      res.status(200).json({ success: true, data: fetchedUser });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Create a new user
  createUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        avatar,
        bio,
        backgroundImage,
        orgs,
        studentId,
        batchYear,
        department,
      } = req.body;

      if (!firstName || !lastName || !username || !email || !password) {
        res
          .status(400)
          .json({ success: false, error: "Missing required fields" });
        return;
      }

      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        res
          .status(400)
          .json({ success: false, error: "Email already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const userData = {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role,
        avatar,
        bio,
        backgroundImage,
        orgs,
        studentId,
        batchYear,
        department,
      };

      const newUser = await createUser(userData);
      if (!newUser) {
        res
          .status(500)
          .json({ success: false, error: "Failed to create user" });
        return;
      }

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      next(error);
    }
  },

  // Delete user by ID
  deleteUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedUser = await deleteUserById(id); // Delete user by ID
      if (!deletedUser) {
        res.status(404).json({ success: false, error: "User not found." });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Update user information
  updateUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      // Check if password is being updated, and if so, hash it
      if (updatedData.password) {
        const salt = bcrypt.genSaltSync(10);
        updatedData.password = bcrypt.hashSync(updatedData.password, salt);
      }

      const updatedUser = await updateUserById(id, updatedData); // Update user by ID
      if (!updatedUser) {
        res.status(404).json({ success: false, error: "User not found." });
        return;
      }

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Login user (for JWT token generation)
  loginUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Check if the email and password are provided
      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, error: "Email and password are required" });
        return;
      }

      // Fetch the user by email
      const user = await getUserByEmail(email);

      console.log("USER: ", user);
      if (!user) {
        res
          .status(401)
          .json({ success: false, error: "Invalid email or password" });
        return;
      }

      // Typecast the user to IUser to ensure proper type checking
      const typedUser = user as IUser;

      // Check if the user has a password
      if (!typedUser.password) {
        res
          .status(401)
          .json({ success: false, error: "Invalid email or password" });
        return;
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(
        password,
        typedUser.password
      );
      if (!isPasswordValid) {
        res
          .status(401)
          .json({ success: false, error: "Invalid email or password" });
        return;
      }

      // Generate JWT token
      const token = generateToken(typedUser._id.toString(), typedUser.role); // Now we can safely access _id

      // Exclude password before sending user data
      const { password: _, ...safeUser } = typedUser.toObject();

      // Return the token in the response
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: safeUser,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      next(error);
    }
  },
};
