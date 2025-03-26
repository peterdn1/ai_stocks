import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stocksAPI } from '../services/api';

const HomePage = () => {
  const [topStocks, setTopStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        setIsLoading(true);
        // Get top 5 stocks by AI impact score
        const response = await stocksAPI.getStocks({
          limit: 5,
          offset: 0,
        });
        setTopStocks(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch top stocks');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchTopStocks();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            Track AI's Impact on the Stock Market
          </h1>
          <p className="text-xl mb-6">
            Discover which companies are leveraging artificial intelligence and how it affects their stock performance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/stocks"
              className="px-6 py-3 bg-white text-primary-700 font-medium rounded-md shadow-sm hover:bg-gray-100 transition-colors"
            >
              Explore Stocks
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md shadow-sm hover:bg-primary-400 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Top AI Stocks Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top AI Impact Stocks</h2>
          <Link
            to="/stocks"
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Impact Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topStocks && topStocks.length > 0 ? topStocks.map((stock) => (
                  <tr key={stock.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/stocks/${stock.symbol}`} className="font-medium text-primary-600 hover:text-primary-800">
                        {stock.symbol}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stock.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          stock.ai_impact_score >= 8 ? 'bg-green-500' :
                          stock.ai_impact_score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        <span className="font-medium">{stock.ai_impact_score.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${stock.last_price?.toFixed(2) || 'N/A'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No stocks data available. The backend server may not be running.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">AI Impact Scoring</h3>
          <p className="text-gray-600">
            Our proprietary algorithm analyzes how companies are leveraging AI and assigns an impact score.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Mock Trading</h3>
          <p className="text-gray-600">
            Practice your investment strategy with virtual capital and track your performance over time.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Alerts & Watchlists</h3>
          <p className="text-gray-600">
            Create custom watchlists and set alerts for price changes or AI impact score updates.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;