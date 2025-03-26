import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { stocksAPI, portfolioAPI } from '../services/api';

const StocksPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingStock, setAddingStock] = useState({});

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stocksAPI.getStocks();
      setStocks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to load stocks data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPortfolio = async (symbol) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      setAddingStock(prev => ({ ...prev, [symbol]: true }));
      await portfolioAPI.addStock(symbol, 1); // Default to 1 share
      alert(`Added 1 share of ${symbol} to your portfolio`);
    } catch (err) {
      console.error('Error adding stock to portfolio:', err);
      alert(err.response?.data?.message || 'Failed to add stock to portfolio');
    } finally {
      setAddingStock(prev => ({ ...prev, [symbol]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Impact Stocks</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Loading stocks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/stocks/${stock.symbol}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {stock.symbol}
                </Link>
                <span className="text-lg font-bold">${stock.last_price?.toFixed(2)}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{stock.name}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{stock.sector}</span>
                <span>{stock.industry}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="mr-2">AI Impact:</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(stock.ai_impact_score || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => handleAddToPortfolio(stock.symbol)}
                    disabled={addingStock[stock.symbol]}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    {addingStock[stock.symbol] ? 'Adding...' : 'Add to Portfolio'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StocksPage;