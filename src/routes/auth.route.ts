import express, { Request, Response } from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwt';  // Ensure generateToken is correctly imported
import { UserModel } from '../models/User.model'; // Import the User model to fetch full user data
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any;

      if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }

      // Fetch full user data from the database
      const fullUser = await UserModel.findById(user._id).lean();

      if (!fullUser) {
        res.status(404).json({ success: false, message: 'User not found in the database' });
        return;
      }

      // Generate JWT token
      const token = generateToken(fullUser._id.toString(), fullUser.role);

      // Remove sensitive data (password) from the user object before sending
      const { password, ...safeUser } = fullUser;

      // Send a successful response with the token and user info
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        user: safeUser, // Return the user data without the password
      });
    } catch (error) {
      console.error('Error during Google authentication:', error);
      res.status(500).json({ success: false, message: 'Error during authentication' });
    }
  }
);





export default router;
