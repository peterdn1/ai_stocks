import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let status = 'error';
  let message = 'Something went wrong';
  let stack: string | undefined;

  // If it's our custom error, use its properties
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    status = 'fail';
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    status = 'fail';
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    status = 'fail';
    message = 'Your token has expired. Please log in again.';
  }

  // Include stack trace in development
  if (env.NODE_ENV === 'development') {
    stack = err.stack;
  }

  // Send response
  res.status(statusCode).json({
    status,
    message,
    ...(stack && { stack }),
    ...(env.NODE_ENV === 'development' && { error: err })
  });
};