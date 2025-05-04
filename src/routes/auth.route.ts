import express from 'express';
import passport from 'passport';

const router = express.Router();

// Route to start Google authentication
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Google Callback route hit');
    console.log('User info from Google:', req.user); // Check this log
    res.redirect('/profile'); // Redirect to profile page
  });

export default router;
