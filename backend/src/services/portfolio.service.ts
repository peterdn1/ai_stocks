import { PrismaClient } from '@prisma/client';
import StockService from './stock.service';

class PortfolioService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserPortfolio(userId: number) {
    try {
      const portfolioItems = await this.prisma.portfolio.findMany({
        where: { user_id: userId },
        include: {
          stock: {
            select: {
              symbol: true,
              name: true,
              sector: true,
              industry: true,
              last_price: true,
              ai_impact_score: true
            }
          }
        }
      });

      // Calculate current values and performance
      const enrichedPortfolio = await Promise.all(
        portfolioItems.map(async (item) => {
          const currentPrice = item.stock.last_price || 
            await StockService.getStockPrice(item.stock_symbol);
          
          const currentValue = item.shares * (currentPrice || 0);
          const costBasis = item.shares * item.average_cost_basis;
          const profitLoss = currentValue - costBasis;
          const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

          return {
            ...item,
            current_price: currentPrice,
            current_value: currentValue,
            cost_basis: costBasis,
            profit_loss: profitLoss,
            profit_loss_percent: profitLossPercent
          };
        })
      );

      return enrichedPortfolio;
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
      throw error;
    }
  }

  async addStockToPortfolio(userId: number, symbol: string, shares: number, price: number) {
    try {
      // Check if the stock exists
      let stock = await this.prisma.stock.findUnique({
        where: { symbol }
      });

      if (!stock) {
        // If stock doesn't exist, get its price and create it
        const stockPrice = await StockService.getStockPrice(symbol);
        if (!stockPrice) {
          throw new Error(`Stock with symbol ${symbol} not found`);
        }

        // Create a new stock with minimal information
        stock = await this.prisma.stock.create({
          data: {
            symbol,
            name: symbol, // Default to symbol, can be updated later
            sector: 'Unknown',
            industry: 'Unknown',
            last_price: stockPrice,
            last_price_update: new Date()
          }
        });
      }

      // Check if the user already has this stock in their portfolio
      const existingPortfolioItem = await this.prisma.portfolio.findUnique({
        where: {
          user_id_stock_symbol: {
            user_id: userId,
            stock_symbol: symbol
          }
        }
      });

      // Record the trade
      await this.prisma.trade.create({
        data: {
          user_id: userId,
          stock_symbol: symbol,
          trade_type: 'BUY',
          shares,
          trade_price: price,
          total_cost: shares * price
        }
      });

      if (existingPortfolioItem) {
        // Update existing portfolio item
        const newTotalShares = existingPortfolioItem.shares + shares;
        const newTotalCost = existingPortfolioItem.shares * existingPortfolioItem.average_cost_basis + shares * price;
        const newAverageCost = newTotalCost / newTotalShares;

        return await this.prisma.portfolio.update({
          where: {
            user_id_stock_symbol: {
              user_id: userId,
              stock_symbol: symbol
            }
          },
          data: {
            shares: newTotalShares,
            average_cost_basis: newAverageCost
          }
        });
      } else {
        // Create new portfolio item
        return await this.prisma.portfolio.create({
          data: {
            user_id: userId,
            stock_symbol: symbol,
            shares,
            average_cost_basis: price
          }
        });
      }
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
      throw error;
    }
  }

  async removeStockFromPortfolio(userId: number, symbol: string, shares: number, price: number) {
    try {
      // Check if the user has this stock in their portfolio
      const existingPortfolioItem = await this.prisma.portfolio.findUnique({
        where: {
          user_id_stock_symbol: {
            user_id: userId,
            stock_symbol: symbol
          }
        }
      });

      if (!existingPortfolioItem) {
        throw new Error(`Stock ${symbol} not found in user's portfolio`);
      }

      if (existingPortfolioItem.shares < shares) {
        throw new Error(`Not enough shares to sell. You have ${existingPortfolioItem.shares} shares.`);
      }

      // Record the trade
      await this.prisma.trade.create({
        data: {
          user_id: userId,
          stock_symbol: symbol,
          trade_type: 'SELL',
          shares,
          trade_price: price,
          total_cost: shares * price
        }
      });

      const newTotalShares = existingPortfolioItem.shares - shares;

      if (newTotalShares === 0) {
        // Remove the portfolio item if no shares left
        return await this.prisma.portfolio.delete({
          where: {
            user_id_stock_symbol: {
              user_id: userId,
              stock_symbol: symbol
            }
          }
        });
      } else {
        // Update the portfolio item
        return await this.prisma.portfolio.update({
          where: {
            user_id_stock_symbol: {
              user_id: userId,
              stock_symbol: symbol
            }
          },
          data: {
            shares: newTotalShares
          }
        });
      }
    } catch (error) {
      console.error('Error removing stock from portfolio:', error);
      throw error;
    }
  }
}

export default new PortfolioService();