import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;
console.log("SECRET_KEY from env:", process.env.SECRET_KEY); 
if (!secretKey) {
    throw new Error('SECRET_KEY is not defined!'); // This will throw an error if SECRET_KEY is not set
  }
  
  export const generateToken = (userId: string, role: string) => {
    const payload = { userId, role };
    const options: jwt.SignOptions = { expiresIn: '1h' };
    return jwt.sign(payload, secretKey, options);
  };
// Function to verify the JWT token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey);  // Verify the token with the secret key
  } catch (error) {
    return null;  // Return null if the token is invalid
  }
};





