import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePermission } from '../../providers/PermissionProvider';
import { ServiceType } from '../../../../core/domain/Shipment';
import { ServiceSwitcher } from './ServiceSwitcher';

interface NavigationProps {
  serviceType: ServiceType;
}

export const Navigation: React.FC<NavigationProps> = ({ serviceType }) => {
  const { currentUser, logout } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  
  const basePath = `/${serviceType.toLowerCase()}`;
  
  const handleLogout = async () => {
    await logout();
    // Redirect to login page after logout
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-primary-600 font-bold text-xl">App</span>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to={basePath}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === basePath 
                    ? 'border-primary-500 text-primary-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to={`${basePath}/shipments`}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === `${basePath}/shipments` 
                    ? 'border-primary-500 text-primary-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Shipments
              </Link>
              <Link 
                to="/settings"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/settings' 
                    ? 'border-primary-500 text-primary-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ServiceSwitcher currentServiceType={serviceType} />
            <div className="flex items-center ml-4 md:ml-6">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentUser?.username}
              </span>
              <button 
                className="ml-3 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to={basePath}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === basePath 
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to={`${basePath}/shipments`}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === `${basePath}/shipments` 
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Shipments
          </Link>
          <Link 
            to="/settings"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.pathname === '/settings' 
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}; 