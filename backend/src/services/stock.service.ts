import axios from 'axios';
import { env } from '../config/env';
import { PrismaClient } from '@prisma/client';

class StockService {
  private apiKey: string;
  private baseUrl: string;
  private prisma: PrismaClient;
  private mockPrices: Record<string, number>;

  constructor() {
    this.apiKey = env.ALPHA_VANTAGE_API_KEY;
    this.baseUrl = 'https://www.alphavantage.co';
    this.prisma = new PrismaClient();
    
    // Mock prices for fallback when API is unavailable
    this.mockPrices = {
      'AAPL': 175.34,
      'MSFT': 410.17,
      'GOOGL': 152.50,
      'AMZN': 178.75,
      'META': 485.58,
      'TSLA': 172.63,
      'NVDA': 880.08,
      'AMD': 160.98,
      'CRM': 273.66,
      'ADBE': 474.62
    };
  }

  async getStockPrice(symbol: string): Promise<number | null> {
    try {
      // Check if API key is set to the default value
      if (this.apiKey === "your-alpha-vantage-api-key") {
        console.warn(`Using mock data for ${symbol} because Alpha Vantage API key is not configured`);
        return this.getFallbackPrice(symbol);
      }
      
      console.log(`Fetching stock price for ${symbol} with API key: ${this.apiKey.substring(0, 3)}...`);
      const url = `${this.baseUrl}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
      console.log(`Request URL: ${url}`);
      
      const response = await axios.get(url);
      console.log(`Response for ${symbol}:`, JSON.stringify(response.data, null, 2));
      
      const data = response.data['Global Quote'];
      if (data && data['05. price']) {
        const price = parseFloat(data['05. price']);
        // Cache the price in the database
        await this.updateStockPrice(symbol, price);
        return price;
      } else {
        console.error(`No data found for symbol ${symbol}. Response:`, JSON.stringify(response.data, null, 2));
        // Try to get the price from the database or use mock data
        return await this.getFallbackPrice(symbol);
      }
    } catch (error: any) {
      console.error(`Error fetching stock price for ${symbol}: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data:`, JSON.stringify(error.response.data, null, 2));
      }
      // Try to get the price from the database or use mock data
      return await this.getFallbackPrice(symbol);
    }
  }

  private async getFallbackPrice(symbol: string): Promise<number | null> {
    try {
      // First try to get the latest price from the database
      const stock = await this.prisma.stock.findUnique({
        where: { symbol },
        select: { last_price: true }
      });

      if (stock && stock.last_price) {
        console.log(`Using cached price for ${symbol}: ${stock.last_price}`);
        return stock.last_price;
      }
    } catch (error) {
      console.error(`Error fetching cached price for ${symbol}:`, error);
    }

    // If no cached price, use mock price
    if (symbol in this.mockPrices) {
      console.log(`Using mock price for ${symbol}: ${this.mockPrices[symbol]}`);
      return this.mockPrices[symbol];
    }

    // Add some randomness for symbols not in our mock list
    const randomPrice = Math.round(100 + Math.random() * 900);
    console.log(`Generated random price for ${symbol}: ${randomPrice}`);
    return randomPrice;
  }

  private async updateStockPrice(symbol: string, price: number): Promise<void> {
    try {
      await this.prisma.stock.update({
        where: { symbol },
        data: {
          last_price: price,
          last_price_update: new Date()
        }
      });
    } catch (error) {
      console.error(`Error updating stock price in database for ${symbol}:`, error);
      // If the stock doesn't exist, create it
      try {
        await this.prisma.stock.create({
          data: {
            symbol,
            name: symbol, // Default name to symbol
            sector: 'Technology', // Default sector
            industry: 'Software', // Default industry
            last_price: price,
            last_price_update: new Date(),
            ai_impact_score: 0.0 // Default impact score
          }
        });
      } catch (createError) {
        console.error(`Error creating stock in database for ${symbol}:`, createError);
      }
    }
  }
}

export default new StockService();