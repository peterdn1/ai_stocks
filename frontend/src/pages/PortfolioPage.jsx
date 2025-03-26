import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { portfolioAPI } from '../services/api';

const PortfolioPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [addingStock, setAddingStock] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
    }
  }, [isAuthenticated]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    
    if (!symbol || !shares || isNaN(shares) || parseInt(shares) <= 0) {
      setError('Please enter a valid stock symbol and number of shares');
      return;
    }

    try {
      setAddingStock(true);
      await portfolioAPI.addStock(
        symbol.toUpperCase(),
        parseInt(shares)
      );
      
      // Reset form
      setSymbol('');
      setShares('');
      setShowAddForm(false);
      setError(null);
      
      // Refresh portfolio
      fetchPortfolio();
    } catch (err) {
      console.error('Error adding stock:', err);
      setError(err.response?.data?.message || 'Failed to add stock to portfolio');
    } finally {
      setAddingStock(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showAddForm ? 'Cancel' : 'Add Stock'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Stock to Portfolio</h2>
          <form onSubmit={handleAddStock}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. AAPL"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="e.g. 10"
                  min="1"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingStock}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {addingStock ? 'Adding...' : 'Add to Portfolio'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Loading portfolio...</p>
        </div>
      ) : portfolio.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Symbol</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-right">Shares</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Current Value</th>
                <th className="py-3 px-4 text-right">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.stock_symbol} className="border-t">
                  <td className="py-3 px-4">
                    <Link to={`/stocks/${item.stock_symbol}`} className="text-blue-600 hover:underline">
                      {item.stock_symbol}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{item.stock.name}</td>
                  <td className="py-3 px-4 text-right">{item.shares}</td>
                  <td className="py-3 px-4 text-right">${item.current_price?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">${item.current_value?.toFixed(2)}</td>
                  <td className={`py-3 px-4 text-right ${item.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${item.profit_loss?.toFixed(2)} ({item.profit_loss_percent?.toFixed(2)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your portfolio is currently empty. Add stocks to track your investments.
          </p>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add Your First Stock
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;