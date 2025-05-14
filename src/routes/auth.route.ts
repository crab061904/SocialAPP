import express, { Request, Response } from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwt';  // Ensure generateToken is correctly imported
import { UserModel } from '../models/User.model'; // Import the User model to fetch full user data
import { authenticateJWT } from "../middleware/authMiddleware";
const router = express.Router();

// Google login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: Request, res: Response): Promise<void> => {
   try {
      const user = req.user as any;  // Passport provides the user data

      if (!user) {
       res.status(401).json({ success: false, error: 'User not found' });
         return
      }

      // Fetch full user data from the database
      const fullUser = await UserModel.findById(user._id).lean();

      if (!fullUser) {
         res.status(404).json({ success: false, error: 'User not found in the database' });
         return
      }

      // Generate JWT token using the fullUser._id (now properly typed)
      const token = generateToken(fullUser._id.toString(), fullUser.role);

      // Remove the sensitive password field before sending back the user object
      const { password, ...safeUser } = fullUser;

      // Send the response similar to the login route
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: safeUser,
      });
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  }
);


// Profile route to show the logged-in user's profile
router.get('/profile', authenticateJWT, (req, res) => {
 const user = req.user as any;  // User is attached to the request object by the middleware

  // Return the authenticated user's profile
  res.status(200).json({ user });
});

router.get('/protected-data', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  const user = req.user as any;  // Or use the extended type here
  
  if (!user || !user._id) {
    res.status(401).json({ message: 'User not authenticated or missing user ID' });
    return;
  }

  try {
    const fullUser = await UserModel.findById(user._id).lean();

    if (!fullUser) {
      res.status(404).json({ message: 'User not found in the database' });
      return;
    }

    const token = generateToken(fullUser._id.toString(), fullUser.role);

    res.status(200).json({
      message: 'This is protected data',
      user: fullUser,
      token: token,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error while fetching user' });
  }
});

export default router;
