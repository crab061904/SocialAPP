import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import morgan from 'morgan';
import methodOverride from 'method-override';

import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import postRoutes from './routes/postRoute';
import reelRoutes from './routes/reelRoute';
import commentRoute from './routes/commentRoute';
import cors from "cors";

const app = express();
// Log the environment variables to make sure they are loaded correctly
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
console.log('Google Callback URL:', process.env.GOOGLE_CALLBACK_URL);
// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SECRET_KEY || 'default-session-secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(cors()); // Allow all origins
// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/comments', commentRoute);

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to the database!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Connection Failed!', error);
    process.exit(1);
  }
};

connectDB();
