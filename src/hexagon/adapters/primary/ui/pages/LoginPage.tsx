import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePermission } from '../../providers/PermissionProvider';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(username, password);
      
      // Check if this is a new user with no active services
      const activeServices = localStorage.getItem('activeServices');
      const isNewUser = !activeServices || activeServices === '[]';
      
      // Redirect to settings for new users, otherwise to the page user was trying to access
      const from = location.state && typeof location.state === 'object' && 'from' in location.state 
        ? (location.state as { from: { pathname: string } }).from.pathname 
        : isNewUser ? '/settings' : '/service-selector';
        
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials. Try using: admin, owner, or customer');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to Logistics System
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="text-red-700">{error}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Note: Any password will work for demo, just use the correct username
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="bg-gray-50 p-4 rounded-md mt-8">
          <h3 className="text-md font-semibold text-gray-900 mb-2">Demo Accounts</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">admin</span>
              Administrator with all permissions
            </li>
            <li className="flex items-center">
              <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">owner</span>
              Business owner with create/view permissions
            </li>
            <li className="flex items-center">
              <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">customer</span>
              Customer with view-only permissions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 