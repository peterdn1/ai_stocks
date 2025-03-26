import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token if it's expired or invalid
      localStorage.removeItem('token');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/signup', { username, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Stocks API
export const stocksAPI = {
  getStocks: (params) => api.get('/stocks', { params }),
  getStockBySymbol: (symbol) => api.get(`/stocks/${symbol}`),
  getStockNews: (symbol, params) => api.get(`/stocks/${symbol}/news`, { params }),
  getSectors: () => api.get('/stocks/sectors'),
  getIndustries: () => api.get('/stocks/industries'),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  getTradeHistory: () => api.get('/portfolio/history'),
};

// Trading API
export const tradeAPI = {
  buyStock: (symbol, shares, price) => api.post('/trade/buy', { stock_symbol: symbol, shares, trade_price: price }),
  sellStock: (symbol, shares, price) => api.post('/trade/sell', { stock_symbol: symbol, shares, trade_price: price }),
};

// Watchlist API
export const watchlistAPI = {
  getWatchlists: () => api.get('/watchlist'),
  createWatchlist: (name) => api.post('/watchlist', { name }),
  getWatchlistItems: (id) => api.get(`/watchlist/${id}`),
  addToWatchlist: (id, symbol) => api.post(`/watchlist/${id}/add`, { stock_symbol: symbol }),
  removeFromWatchlist: (id, symbol) => api.delete(`/watchlist/${id}/remove/${symbol}`),
};

// Alerts API
export const alertsAPI = {
  getAlerts: () => api.get('/alerts'),
  createAlert: (alert) => api.post('/alerts', alert),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
};

// AI Impact API
export const impactAPI = {
  getImpactScore: (symbol) => api.get(`/impact/${symbol}`),
};

export default api;