import React, { useEffect, useState } from 'react';
import { Shipment, ServiceType } from '../../core/domain/Shipment';
import { ShipmentService } from '../../core/ports/input/ShipmentService';
import { useI18n } from './i18n/I18nProvider';

interface ShipmentDashboardAdapterProps {
  shipmentService: ShipmentService;
  serviceType: ServiceType;
}

export const ShipmentDashboardAdapter: React.FC<ShipmentDashboardAdapterProps> = ({
  shipmentService,
  serviceType
}) => {
  const { formatStatus } = useI18n();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const data = await shipmentService.getShipmentsByServiceType(serviceType);
        setShipments(data);
      } catch (error) {
        console.error(`Failed to load ${serviceType} shipments:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadShipments();
  }, [serviceType, shipmentService]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Count shipments by status
  const shipmentCounts = {
    created: shipments.filter(s => s.status === 'CREATED').length,
    pickedUp: shipments.filter(s => s.status === 'PICKED_UP').length,
    inTransit: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    outForDelivery: shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
    failedDelivery: shipments.filter(s => s.status === 'FAILED_DELIVERY').length,
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-100 text-indigo-800';
      case 'PROCESSING':
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED_DELIVERY':
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      case 'PICKED_UP':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{serviceType} Shipments Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Shipments</h3>
          <p className="text-3xl font-bold text-primary-600">{shipments.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Created</h3>
          <p className="text-3xl font-bold text-yellow-600">{shipmentCounts.created}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Picked Up</h3>
          <p className="text-3xl font-bold text-purple-600">{shipmentCounts.pickedUp}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">In Transit</h3>
          <p className="text-3xl font-bold text-blue-600">{shipmentCounts.inTransit}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Out For Delivery</h3>
          <p className="text-3xl font-bold text-indigo-600">{shipmentCounts.outForDelivery}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Delivered</h3>
          <p className="text-3xl font-bold text-green-600">{shipmentCounts.delivered}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Failed Delivery</h3>
          <p className="text-3xl font-bold text-red-600">{shipmentCounts.failedDelivery}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Shipments</h2>
        {shipments.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center text-gray-500 rounded-md">
            <p>No {serviceType} shipments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shipments.slice(0, 5).map((shipment) => (
              <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-primary-600 mb-2">Tracking: {shipment.trackingNumber}</h3>
                <div className="mb-2">
                  Status: <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>{formatStatus(shipment.status)}</span>
                </div>
                <p className="text-sm text-gray-600">From: {shipment.origin.city}, {shipment.origin.country}</p>
                <p className="text-sm text-gray-600">To: {shipment.destination.city}, {shipment.destination.country}</p>
                <p className="text-sm text-gray-600 mt-2">Items: {shipment.items.length}</p>
                {['B2B'].includes(serviceType) && (
                  <p className="text-sm text-gray-600 mt-1 truncate">Items name: {shipment.items.map(item => item.name).join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 