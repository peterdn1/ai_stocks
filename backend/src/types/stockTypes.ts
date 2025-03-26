export interface StockPriceResponse {
  symbol: string;
  price: number;
  currency?: string;
  error?: string;
}

export interface StockWithDetails {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  last_price: number | null;
  ai_impact_score: number;
  last_price_update: Date | null;
}