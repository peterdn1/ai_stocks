import * as jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import { env } from '../config/env';

/**
 * Generate a JWT token for a user
 * @param userId User ID to include in the token
 * @returns JWT token string
 */
export const generateToken = (userId: number): string => {
  const options: jwt.SignOptions = {
    expiresIn: ms(env.JWT_EXPIRES_IN as StringValue) // Type assertion for valid time string format
  };
  
  return jwt.sign({ id: userId }, env.JWT_SECRET, options);
};