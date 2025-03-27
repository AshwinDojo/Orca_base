import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceType } from '../../../../core/domain/Shipment';

interface ServiceSwitcherProps {
  currentServiceType: ServiceType;
}

export const ServiceSwitcher: React.FC<ServiceSwitcherProps> = ({ 
  currentServiceType 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const serviceTypes = [
    { id: 'B2B', name: 'B2B Shipping', path: '/b2b', icon: '🏭' },
    { id: 'B2C', name: 'B2C Shipping', path: '/b2c', icon: '🏠' },
    { id: 'INTERNATIONAL', name: 'International Shipping', path: '/international', icon: '🌐' }
  ];

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleServiceTypeChange = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentService = serviceTypes.find(st => st.id === currentServiceType);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={handleToggleDropdown}
      >
        <span className="mr-2">{currentService?.icon}</span>
        <span className="mr-1">{currentService?.name}</span>
        <svg className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 overflow-hidden">
          <div className="bg-primary-50 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-primary-800">Switch Service Type</h3>
          </div>
          
          <div className="py-1">
            {serviceTypes.map(serviceType => (
              <button
                key={serviceType.id}
                className={`w-full text-left px-4 py-2 text-sm ${
                  serviceType.id === currentServiceType 
                    ? 'bg-primary-100 text-primary-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleServiceTypeChange(serviceType.path)}
                disabled={serviceType.id === currentServiceType}
              >
                <span className="mr-2">{serviceType.icon}</span>
                <span>{serviceType.name}</span>
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
            <button 
              className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => navigate('/service-selector')}
            >
              View All Services
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 