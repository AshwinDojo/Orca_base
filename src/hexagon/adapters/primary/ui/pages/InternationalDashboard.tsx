import React from 'react';
import { useServiceType } from '../../providers/ServiceTypeProvider';
import { Navigation } from '../components/Navigation';
import { ShipmentDashboardAdapter } from '../../ShipmentDashboardAdapter';

export const InternationalDashboard: React.FC = () => {
  const { serviceType, shipmentService } = useServiceType();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation serviceType={serviceType} />
      <div className="py-6">
        <ShipmentDashboardAdapter 
          shipmentService={shipmentService}
          serviceType={serviceType}
        />
      </div>
    </div>
  );
}; 