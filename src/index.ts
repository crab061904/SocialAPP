 // Make sure this is at the very top
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';  // Import morgan for logging requests
import methodOverride from 'method-override';  // Import method-override for HTTP methods support
import userRoutes from './routes/user.route';  // Import user routes
require('dotenv').config(); 
// Initialize the app
const app = express();

// Middleware for parsing application/json
app.use(express.json());

// Middleware for logging requests
app.use(morgan('dev'));  // Log HTTP requests with the 'dev' format (can be customized)

// Middleware for supporting HTTP methods like PUT and DELETE from forms
app.use(methodOverride('_method'));

// Check if MONGO_URI is available in the environment variables
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

// Routes for user management
app.use('/api/users', userRoutes);

// MongoDB connection using async/await for better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to the database!');
    console.log('MONGO_URI:', process.env.MONGO_URI);  // Log to verify connection string

    // Start the server after successful database connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Connection Failed!', error);
    process.exit(1); // Exit the process with a non-zero status code if MongoDB connection fails
  }
};

// Call the connectDB function to establish the connection
connectDB();
