import express, { Request, Response } from 'express';
// Import StockService directly using require
const StockService = require('../services/stock.service').default;

const router = express.Router();

// GET /api/stocks
router.get('/', async (req: Request, res: Response) => {
  try {
    const stocks = ['AAPL', 'MSFT', 'GOOGL']; // Example symbols
    const stockData = await Promise.all(
      stocks.map(async (symbol) => {
        const price = await StockService.getStockPrice(symbol);
        return { symbol: symbol, price: price };
      })
    );
    res.json(stockData);
  } catch (error: any) {
    console.error("Error fetching stock data: " + error.message);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
});

// GET /api/stocks/:symbol
router.get('/:symbol', async (req: Request, res: Response) => {
  const symbol = req.params.symbol;
  try {
    const price = await StockService.getStockPrice(symbol);
    if (price) {
      res.json({ symbol: symbol, price: price });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error: any) {
    console.error("Error fetching stock price for " + symbol + ": " + error.message);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
});

module.exports = router;