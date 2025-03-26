import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { stocksAPI, portfolioAPI } from '../services/api';

const StockDetailPage = () => {
  const { isAuthenticated } = useAuthStore();
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shares, setShares] = useState(1);
  const [addingToPortfolio, setAddingToPortfolio] = useState(false);

  useEffect(() => {
    fetchStockDetails();
  }, [symbol]);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const response = await stocksAPI.getStockBySymbol(symbol);
      console.log('Stock details response:', response.data);
      setStock(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock details:', err);
      setError('Failed to load stock details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPortfolio = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!shares || isNaN(shares) || parseInt(shares) <= 0) {
      setError('Please enter a valid number of shares');
      return;
    }

    try {
      setAddingToPortfolio(true);
      await portfolioAPI.addStock(symbol, parseInt(shares));
      alert(`Added ${shares} share(s) of ${symbol} to your portfolio`);
      setShares(1);
    } catch (err) {
      console.error('Error adding stock to portfolio:', err);
      setError(err.response?.data?.message || 'Failed to add stock to portfolio');
    } finally {
      setAddingToPortfolio(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <p className="text-center py-8">Loading stock details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{symbol}</h1>
          {stock && <p className="text-gray-500 mt-1">{stock.name}</p>}
        </div>
        {stock && (
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">
              ${stock.price ? stock.price.toFixed(2) : (stock.last_price ? stock.last_price.toFixed(2) : '0.00')}
            </div>
            <div className="text-sm text-gray-500">Current Price</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Stock Information</h2>
            {stock && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium text-gray-800">{stock.name}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">Sector</p>
                    <p className="font-medium text-gray-800">{stock.sector}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">Industry</p>
                    <p className="font-medium text-gray-800">{stock.industry}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">AI Impact Score</p>
                    <div className="flex items-center mt-1">
                      <span className="mr-3 font-medium text-gray-800">{(stock.ai_impact_score || 0).toFixed(2)}</span>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(stock.ai_impact_score || 0) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Add to Portfolio</h2>
              <form onSubmit={handleAddToPortfolio}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Shares</label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    min="1"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {stock && (
                  <div className="mb-5 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">
                      Estimated Cost: <span className="text-blue-600 font-semibold">
                        ${((stock.price || stock.last_price || 0) * (parseFloat(shares) || 0)).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={addingToPortfolio}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md transition-colors duration-200"
                >
                  {addingToPortfolio ? 'Adding...' : 'Add to Portfolio'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetailPage;