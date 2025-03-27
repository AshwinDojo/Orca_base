import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../providers/PermissionProvider';

interface ServiceTypeOption {
  id: string;
  name: string;
  path: string;
  description: string;
  icon: string;
}

export const ServiceSelectorPage: React.FC = () => {
  const { currentUser, hasPermission, logout } = usePermission();
  const [availableServiceTypes, setAvailableServiceTypes] = useState<ServiceTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const serviceTypeOptions: ServiceTypeOption[] = [
    {
      id: 'b2b',
      name: 'B2B Shipping',
      path: '/b2b',
      description: 'Business-to-Business shipping management',
      icon: '🏭'
    },
    {
      id: 'b2c',
      name: 'B2C Shipping',
      path: '/b2c',
      description: 'Business-to-Consumer shipping and delivery',
      icon: '🏠'
    },
    {
      id: 'international',
      name: 'International Shipping',
      path: '/international',
      description: 'Cross-border shipping and customs handling',
      icon: '🌐'
    }
  ];

  useEffect(() => {
    const checkServiceTypePermissions = async () => {
      setLoading(true);
      
      // Check permissions for each service type
      const availableTypes = [];
      
      for (const serviceType of serviceTypeOptions) {
        // Check if user has read permission for this service type
        const hasAccess = await hasPermission('read', 'shipment');
        if (hasAccess) {
          availableTypes.push(serviceType);
        }
      }
      
      setAvailableServiceTypes(availableTypes);
      setLoading(false);
    };
    
    checkServiceTypePermissions();
  }, [hasPermission]);

  const handleServiceTypeSelect = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {currentUser?.username}</h1>
          <p className="text-xl text-gray-600">Select a service type to continue</p>
        </div>
        
        {availableServiceTypes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-700 mb-4">You don't have access to any service types.</p>
            <p className="text-gray-600 mb-6">You can still use the settings page to activate services you have permission for.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={goToSettings}
              >
                Go to Settings
              </button>
              <button 
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServiceTypes.map(serviceType => (
              <div 
                key={serviceType.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                onClick={() => handleServiceTypeSelect(serviceType.path)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{serviceType.icon}</span>
                    <h2 className="text-xl font-bold text-gray-900">{serviceType.name}</h2>
                  </div>
                  <p className="text-gray-600">{serviceType.description}</p>
                </div>
                <div className="bg-primary-50 py-2 px-6 text-right">
                  <span className="text-primary-600 text-sm font-medium">Select →</span>
                </div>
              </div>
            ))}
            <div 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              onClick={goToSettings}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">⚙️</span>
                  <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                </div>
                <p className="text-gray-600">Manage service settings and account preferences</p>
              </div>
              <div className="bg-gray-50 py-2 px-6 text-right">
                <span className="text-gray-700 text-sm font-medium">Configure →</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <button 
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
            onClick={handleLogout}
          >
            Logout from account
          </button>
        </div>
      </div>
    </div>
  );
}; 