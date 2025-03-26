import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import StockService from '../services/stock.service';
import { StockPriceResponse, StockWithDetails } from '../types/stockTypes';

const router: Router = express.Router();
const prisma = new PrismaClient();

// GET /api/stocks
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // First check if we have any stocks in the database
    let stocks = await prisma.stock.findMany({
      select: {
        symbol: true,
        name: true,
        sector: true,
        industry: true,
        last_price: true,
        ai_impact_score: true,
        last_price_update: true
      },
      orderBy: { symbol: 'asc' }
    });

    // If no stocks in database, create some default ones
    if (stocks.length === 0) {
      console.log('No stocks found in database. Creating default stocks...');
      const defaultStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Content & Information' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Internet Content & Information' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', industry: 'Software' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software' }
      ];

      // Create the default stocks in the database
      for (const stock of defaultStocks) {
        await prisma.stock.create({
          data: {
            ...stock,
            ai_impact_score: 0.0
          }
        });
      }

      // Fetch the newly created stocks
      stocks = await prisma.stock.findMany({
        select: {
          symbol: true,
          name: true,
          sector: true,
          industry: true,
          last_price: true,
          ai_impact_score: true,
          last_price_update: true
        },
        orderBy: { symbol: 'asc' }
      });
    }

    // Refresh prices from Alpha Vantage or use fallback
    const updatedStocks = await Promise.all(
      stocks.map(async (stock: StockWithDetails) => {
        const livePrice = await StockService.getStockPrice(stock.symbol);
        
        // If we got a price (either from API or fallback), update the stock
        if (livePrice !== null) {
          return {
            ...stock,
            last_price: livePrice,
            last_price_update: new Date()
          };
        }
        
        return stock;
      })
    );

    res.json(updatedStocks);
  } catch (error: any) {
    console.error("Error fetching stock data: " + error.message);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
});

// GET /api/stocks/:symbol
router.get('/:symbol', async (req: Request, res: Response): Promise<void> => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    // First get the stock details from the database
    let stock = await prisma.stock.findUnique({
      where: { symbol },
      select: {
        symbol: true,
        name: true,
        sector: true,
        industry: true,
        last_price: true,
        ai_impact_score: true,
        last_price_update: true
      }
    });

    // If stock not found in database, check if it's one of our default stocks
    if (!stock) {
      const defaultStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Content & Information' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Internet Content & Information' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', industry: 'Software' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software' }
      ];
      
      const defaultStock = defaultStocks.find(s => s.symbol === symbol);
      
      if (defaultStock) {
        // Create the stock in the database
        await prisma.stock.create({
          data: {
            ...defaultStock,
            ai_impact_score: Math.random() * 0.8 + 0.1 // Random score between 0.1 and 0.9
          }
        });
        
        // Fetch the newly created stock
        stock = await prisma.stock.findUnique({
          where: { symbol },
          select: {
            symbol: true,
            name: true,
            sector: true,
            industry: true,
            last_price: true,
            ai_impact_score: true,
            last_price_update: true
          }
        });
      }
    }

    if (!stock) {
      res.status(404).json({ message: 'Stock not found' });
      return;
    }

    // Get the latest price
    const price = await StockService.getStockPrice(symbol);
    
    // Return the stock with the updated price
    res.json({
      ...stock,
      price: price || stock.last_price
    });
  } catch (error: any) {
    console.error("Error fetching stock data for " + symbol + ": " + error.message);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
});

export default router;