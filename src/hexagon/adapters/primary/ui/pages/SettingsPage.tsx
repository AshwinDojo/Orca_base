import React, { useState, useEffect } from 'react';
import { usePermission } from '../../providers/PermissionProvider';
import { Navigation } from '../components/Navigation';
import { UserManagement } from '../components/UserManagement';

interface Service {
  id: string;
  name: string;
  description: string;
  active: boolean;
  requiredPermission: {
    action: string;
    resource: string;
  };
}

export const SettingsPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const [services, setServices] = useState<Service[]>([
    {
      id: 'b2b',
      name: 'B2B Service',
      description: 'Business-to-Business shipping solutions',
      active: false,
      requiredPermission: {
        action: 'update',
        resource: 'service:b2b'
      }
    },
    {
      id: 'b2c',
      name: 'B2C Service',
      description: 'Business-to-Consumer shipping solutions',
      active: false,
      requiredPermission: {
        action: 'update',
        resource: 'service:b2c'
      }
    },
    {
      id: 'international',
      name: 'International Service',
      description: 'International shipping solutions',
      active: false,
      requiredPermission: {
        action: 'update',
        resource: 'service:international'
      }
    }
  ]);
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Check if user can manage users
  useEffect(() => {
    const checkUserManagementPermission = async () => {
      const canManage = await hasPermission('update', 'user');
      setCanManageUsers(canManage);
    };
    
    checkUserManagementPermission();
  }, [hasPermission]);

  // Check permissions for each service
  useEffect(() => {
    const checkPermissions = async () => {
      const permissionsMap: Record<string, boolean> = {};
      let hasAnyPermission = false;
      
      for (const service of services) {
        const { action, resource } = service.requiredPermission;
        const hasServicePermission = await hasPermission(action, resource);
        permissionsMap[service.id] = hasServicePermission;
        
        if (hasServicePermission) {
          hasAnyPermission = true;
        }
      }
      
      setPermissions(permissionsMap);
      
      // Check if this might be a new user (no active services and at least one permission)
      const activeServices = localStorage.getItem('activeServices');
      if (hasAnyPermission && (!activeServices || activeServices === '[]')) {
        setIsNewUser(true);
      }
      
      setLoading(false);
    };
    
    checkPermissions();
  }, [services, hasPermission]);

  // Load active services (in a real app, this would come from an API)
  useEffect(() => {
    // Simulate API call to get active services
    const getActiveServices = async () => {
      // In a real app, fetch from backend
      const activeServices = localStorage.getItem('activeServices');
      
      if (activeServices) {
        try {
          const activeServiceIds = JSON.parse(activeServices) as string[];
          
          setServices(prev => 
            prev.map(service => ({
              ...service,
              active: activeServiceIds.includes(service.id)
            }))
          );
        } catch (error) {
          console.error('Failed to parse active services:', error);
        }
      }
      
      setLoading(false);
    };
    
    getActiveServices();
  }, []);

  const toggleServiceStatus = async (serviceId: string) => {
    // In a real app, this would call an API to activate/deactivate the service
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, active: !service.active } 
        : service
    ));
    
    // Update localStorage (simulating backend)
    const updatedServices = services.map(s => 
      s.id === serviceId ? { ...s, active: !s.active } : s
    );
    
    const activeServiceIds = updatedServices
      .filter(s => s.active)
      .map(s => s.id);
    
    localStorage.setItem('activeServices', JSON.stringify(activeServiceIds));
    
    // No longer a new user after activating a service
    if (isNewUser) {
      setIsNewUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation serviceType="B2B" />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
        
        {isNewUser && (
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-6 rounded">
            <h2 className="text-xl font-semibold text-primary-800 mb-1">Welcome to Delhivery One!</h2>
            <p className="text-gray-700">To get started, please activate the services you'd like to use below.</p>
          </div>
        )}
        
        <p className="text-gray-600 mb-8">Manage your service settings and preferences</p>
        
        {/* Tabs for different settings sections */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex -mb-px space-x-8">
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'services'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            
            {canManageUsers && (
              <button
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'users'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('users')}
              >
                User Management
              </button>
            )}
          </nav>
        </div>
        
        {activeTab === 'services' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">Available Services</h2>
            
            <div className="space-y-6">
              {services.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      {permissions[service.id] ? (
                        <button 
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            service.active 
                              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                              : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          onClick={() => toggleServiceStatus(service.id)}
                        >
                          {service.active ? 'Deactivate' : 'Activate'}
                        </button>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          You don't have permission to modify this service.
                          {!Object.values(permissions).some(p => p) && (
                            <div className="text-xs text-gray-400 mt-1">
                              Please contact your administrator to request access.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'users' && canManageUsers && (
          <UserManagement />
        )}
      </div>
    </div>
  );
}; 