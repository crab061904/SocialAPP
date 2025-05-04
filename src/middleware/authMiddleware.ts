import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

  if (!token) {
    res.status(403).json({ success: false, error: 'Token is required' });
    return;
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  // Attach user info to the request object
  (req as Request & { user: any }).user = decoded;  // Explicitly cast the type
  next();  // Pass control to the next middleware or route handler
};
