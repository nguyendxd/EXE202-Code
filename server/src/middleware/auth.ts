import dotenv from "dotenv";
dotenv.config();
import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        role: string;
        email: string;
        [key: string]: any;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('\n\n========== AUTH MIDDLEWARE DEBUG ==========');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('❌ No authorization header found');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  if (!token) {
    console.log('❌ No token found in authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    console.log('JWT Secret:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', JSON.stringify(decoded, null, 2));
    
    // Ensure the decoded token has the required fields
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid token structure');
    }

    // Set the user information in the request
    req.user = {
      uid: (decoded as any).uid,
      role: (decoded as any).role,
      email: (decoded as any).email
    };
    
    console.log('✅ User authenticated successfully:', req.user);
    console.log('===========================================\n\n');
    next();
  } catch (error) {
    console.log('❌ Token verification error:', error);
    console.log('===========================================\n\n');
    return res.status(403).json({ message: 'Invalid token' });
  }
};
