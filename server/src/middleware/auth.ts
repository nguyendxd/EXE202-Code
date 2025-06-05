import dotenv from "dotenv";
dotenv.config();
import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import { getUserByFirebaseUID } from "../repository/userRepository"; // Import the function to get user from DB by Firebase UID
import { IUser } from "../model/User"; // Import IUser interface

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Add MongoDB _id
        uid: string;
        role: string;
        email: string;
        [key: string]: any;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  if (!token) {
    console.log('No token found in authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    console.log('JWT Secret:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', JSON.stringify(decoded, null, 2));
    
    // Ensure the decoded token has the required fields, specifically uid
    if (!decoded || typeof decoded !== 'object' || !(decoded as any).uid) {
      console.error('Invalid token structure or missing UID');
      throw new Error('Invalid token structure or missing UID');
    }

    const firebaseUID = (decoded as any).uid;

    // Fetch the user from your MongoDB database using the firebaseUID
    const userFromDB: IUser | null = await getUserByFirebaseUID(firebaseUID);

    if (!userFromDB) {
      console.error('User not found in database for UID:', firebaseUID);
      return res.status(403).json({ message: 'User not found' });
    }

    // Set the user information in the request, including the MongoDB _id
    req.user = {
      id: (userFromDB._id as any).toString(), // Use MongoDB _id as the 'id' and cast to any to resolve unknown type error
      uid: userFromDB.firebaseUID,
      role: userFromDB.role,
      email: userFromDB.email,
      // You can include other fields from userFromDB if needed for AuthenticatedRequest
    };
    
    console.log('User authenticated and data loaded from DB:', req.user);
    next();
  } catch (error: any) {
    console.error('Token verification or DB fetch error:', error);
    return res.status(403).json({ message: 'Invalid token or user data issue', error: error.message });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};
