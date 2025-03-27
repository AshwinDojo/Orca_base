import React from 'react';
import { ShipmentListingAdapter } from '../../ShipmentListingAdapter';
import { useServiceType } from '../../providers/ServiceTypeProvider';
import { Navigation } from '../../ui/components/Navigation';

export const B2BShipmentListingPage: React.FC = () => {
  const { serviceType, shipmentService } = useServiceType();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation serviceType={serviceType} />
      
      <div className="py-6">
        <ShipmentListingAdapter 
          shipmentService={shipmentService}
          serviceType={serviceType}
          title={`${serviceType} Shipments Listing`}
        />
      </div>
    </div>
  );
}; 