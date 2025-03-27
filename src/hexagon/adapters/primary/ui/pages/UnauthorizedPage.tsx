import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePermission } from '../../providers/PermissionProvider';

export const UnauthorizedPage: React.FC = () => {
  const { currentUser, logout } = usePermission();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg text-center bg-white p-8 rounded-lg shadow-md">
        <svg className="h-16 w-16 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
        
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Unauthorized Access</h1>
        
        <p className="mt-4 text-base text-gray-600">
          Sorry, <span className="text-primary-600 font-medium">{currentUser?.username || 'you'}</span> don't have permission to access this resource.
        </p>
        
        <div className="mt-2 inline-block bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
          Your current role(s): 
          <span className="font-medium">
            {currentUser?.roles.map(role => role.name).join(', ') || 'None'}
          </span>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link 
            to="/" 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Go to Home
          </Link>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}; 