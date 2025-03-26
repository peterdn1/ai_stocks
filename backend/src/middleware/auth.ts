import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
// Authentication middleware utilities
import { env } from '../config/env';
import prisma from '../config/database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return next(new Error('Not authorized: No authentication token'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
      iat: number;
      exp: number;
    };
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true }
    });
    
    if (!user) {
      return next(new Error('Not authorized: User not found'));
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    });
  }
};