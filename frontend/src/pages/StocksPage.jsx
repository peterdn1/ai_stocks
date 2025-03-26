import React from 'react';
import { useAuthStore } from '../store/authStore';

const StocksPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Impact Stocks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stock cards would go here */}
      </div>
    </div>
  );
};

export default StocksPage;