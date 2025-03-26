import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { env } from './config/env';
import prisma from './config/database';
import { errorHandler } from './middleware/error';

// Import routes
import authRoutes from './routes/auth.routes';
// Import stock routes directly
const stockRoutes = require('./routes/stock.routes');

// Initialize Express app
const app = express();
const port = env.PORT;

// Validate environment variables
try {
  env.validate();
} catch (error: any) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to AI Stock Impact Tracker API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
// app.use('/api/impact', impactRoutes);
// app.use('/api/portfolio', portfolioRoutes);
// app.use('/api/trade', tradeRoutes);
// app.use('/api/watchlist', watchlistRoutes);
// app.use('/api/alerts', alertRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
  process.exit(0);
});

export default app;