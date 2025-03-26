import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const StockDetailPage = () => {
  const { isAuthenticated } = useAuthStore();
  const { symbol } = useParams();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{symbol} Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock detail sections would go here */}
      </div>
    </div>
  );
};

export default StockDetailPage;