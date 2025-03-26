import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables with type checking and defaults
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL as string,
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // External APIs
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Validation
  validate: (): void => {
    const requiredVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'ALPHA_VANTAGE_API_KEY',
      'OPENAI_API_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};