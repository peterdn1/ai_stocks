import React from 'react';
import { useAuthStore } from '../store/authStore';

const PortfolioPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Portfolio items would go here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-500 dark:text-gray-400">
            Your portfolio is currently empty. Add stocks to track your investments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;