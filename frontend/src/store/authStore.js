import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, data } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user: data.user,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      return false;
    }
  },
  
  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/auth/signup', { 
        username, 
        email, 
        password 
      });
      const { token, data } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user: data.user,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      return false;
    }
  },
  
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    set({ 
      user: null,
      isAuthenticated: false,
      error: null
    });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    
    try {
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch current user
      const response = await axios.get('/api/auth/me');
      
      set({ 
        user: response.data.data.user,
        isAuthenticated: true 
      });
      
      return true;
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      set({ 
        user: null,
        isAuthenticated: false,
        error: 'Session expired. Please login again.'
      });
      
      return false;
    }
  },
  
  clearError: () => set({ error: null })
}));