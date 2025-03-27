import React, { createContext, useContext, ReactNode } from 'react';
import { ServiceType } from '../../../core/domain/Shipment';
import { ShipmentService } from '../../../core/ports/input/ShipmentService';

interface ServiceTypeContextType {
  serviceType: ServiceType;
  shipmentService: ShipmentService;
}

const ServiceTypeContext = createContext<ServiceTypeContextType | undefined>(undefined);

interface ServiceTypeProviderProps {
  children: ReactNode;
  serviceType: ServiceType;
  shipmentService: ShipmentService;
}

export const ServiceTypeProvider: React.FC<ServiceTypeProviderProps> = ({ 
  children, 
  serviceType,
  shipmentService
}) => {
  const value = {
    serviceType,
    shipmentService
  };

  return (
    <ServiceTypeContext.Provider value={value}>
      {children}
    </ServiceTypeContext.Provider>
  );
};

export const useServiceType = (): ServiceTypeContextType => {
  const context = useContext(ServiceTypeContext);
  if (context === undefined) {
    throw new Error('useServiceType must be used within a ServiceTypeProvider');
  }
  return context;
}; 