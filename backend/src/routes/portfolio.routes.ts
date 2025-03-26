import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PortfolioService from '../services/portfolio.service';
import StockService from '../services/stock.service';
import { protect } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's portfolio
// GET /api/portfolio
router.get('/', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const portfolio = await PortfolioService.getUserPortfolio(userId);
    res.json(portfolio);
  } catch (error: any) {
    console.error('Error fetching portfolio:', error.message);
    res.status(500).json({ message: 'Failed to fetch portfolio data' });
  }
});

// Add stock to portfolio
// POST /api/portfolio
router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { symbol, shares } = req.body;
    
    if (!symbol || !shares || shares <= 0) {
      res.status(400).json({ message: 'Symbol and positive number of shares are required' });
      return;
    }

    // Get current stock price
    const price = await StockService.getStockPrice(symbol);
    if (!price) {
      res.status(404).json({ message: `Stock with symbol ${symbol} not found` });
      return;
    }

    // Add stock to portfolio
    const result = await PortfolioService.addStockToPortfolio(userId, symbol, shares, price);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error adding stock to portfolio:', error.message);
    res.status(500).json({ message: 'Failed to add stock to portfolio' });
  }
});

// Remove stock from portfolio
// DELETE /api/portfolio/:symbol
router.delete('/:symbol', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { symbol } = req.params;
    const { shares } = req.body;
    
    if (!shares || shares <= 0) {
      res.status(400).json({ message: 'Positive number of shares is required' });
      return;
    }

    // Get current stock price
    const price = await StockService.getStockPrice(symbol);
    if (!price) {
      res.status(404).json({ message: `Stock with symbol ${symbol} not found` });
      return;
    }

    // Remove stock from portfolio
    const result = await PortfolioService.removeStockFromPortfolio(userId, symbol, shares, price);
    res.json(result);
  } catch (error: any) {
    console.error('Error removing stock from portfolio:', error.message);
    res.status(500).json({ message: 'Failed to remove stock from portfolio', error: error.message });
  }
});

export default router;