// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error('SECRET_KEY is not defined!');
}

// Update generateToken to use _id instead of userId
export const generateToken = (userId: string, role: string) => {
  const payload = { _id: userId, role };  // Use _id in the JWT payload
  const options: jwt.SignOptions = { expiresIn: '24h' }; // Token expiration in 24 hours
  return jwt.sign(payload, secretKey, options);
};

// Function to verify the JWT token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey) as { _id: string; role: string };  // Expecting _id in the token payload
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;  // Return null if token is invalid or expired
  }
};
