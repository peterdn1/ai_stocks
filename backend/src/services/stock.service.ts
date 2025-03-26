import axios from 'axios';
import { env } from '../config/env';

class StockService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.ALPHA_VANTAGE_API_KEY;
    this.baseUrl = 'https://www.alphavantage.co';
  }

  async getStockPrice(symbol: string): Promise<number | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`);
      const data = response.data['Global Quote'];
      if (data) {
        return parseFloat(data['05. price']);
      } else {
        console.error(`No data found for symbol ${symbol}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error fetching stock price for ${symbol}: ${error.message}`);
      return null;
    }
  }
}

export default new StockService();