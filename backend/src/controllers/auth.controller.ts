import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/error';

// Define request body types for type safety
interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Register a new user
 * @route POST /api/auth/signup
 */
export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({
        status: 'fail',
        message: 'User with that username or email already exists'
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword
      }
    });

    // Generate token
    const token = generateToken(user.id);

    // Send response
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          virtual_capital: user.virtual_capital
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if password is correct
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    // Send response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          virtual_capital: user.virtual_capital
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // User is already attached to req by the protect middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        email: true,
        virtual_capital: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};