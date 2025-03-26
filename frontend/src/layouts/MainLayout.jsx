import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const MainLayout = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-600">
                  AI Stock Impact Tracker
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location.pathname === '/' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Home
                </Link>
                <Link to="/stocks" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location.pathname.startsWith('/stocks') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Stocks
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/portfolio" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location.pathname === '/portfolio' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                      Portfolio
                    </Link>
                    <Link to="/watchlist" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location.pathname === '/watchlist' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                      Watchlist
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/" onClick={closeMobileMenu} className={`block pl-3 pr-4 py-2 border-l-4 ${location.pathname === '/' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
                Home
              </Link>
              <Link to="/stocks" onClick={closeMobileMenu} className={`block pl-3 pr-4 py-2 border-l-4 ${location.pathname.startsWith('/stocks') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
                Stocks
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/portfolio" onClick={closeMobileMenu} className={`block pl-3 pr-4 py-2 border-l-4 ${location.pathname === '/portfolio' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
                    Portfolio
                  </Link>
                  <Link to="/watchlist" onClick={closeMobileMenu} className={`block pl-3 pr-4 py-2 border-l-4 ${location.pathname === '/watchlist' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
                    Watchlist
                  </Link>
                </>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Signed in as {user?.username}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AI Stock Impact Tracker. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;