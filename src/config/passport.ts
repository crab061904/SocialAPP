import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Make sure this is imported

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL, // Ensure this is correct
},
(accessToken: string, refreshToken: string, profile: any, done: Function) => {
  console.log('Google Profile:', profile);  // You can use this to store or manage user profile
  return done(null, profile); // This should serialize the user
}));

// Serialize and deserialize the user (optional, but required for persistent login sessions)
passport.serializeUser((user: any, done: Function) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: Function) => {
  done(null, user);
});
