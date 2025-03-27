import React from 'react';
import { Shipment } from '../../../../core/domain/Shipment';
import { useI18n } from '../../i18n/I18nProvider';

interface ShipmentListProps {
  shipments: Shipment[];
  isLoading: boolean;
  emptyMessage: string;
  onViewDetails?: (shipment: Shipment) => void;
  onUpdateStatus?: (shipment: Shipment, newStatus: string) => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  isLoading,
  emptyMessage,
  onViewDetails,
  onUpdateStatus
}) => {
  const { formatStatus } = useI18n();

  if (isLoading && shipments.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (shipments.length === 0 && !isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 italic">
        {emptyMessage}
      </div>
    );
  }

  const statusOptions = ['CREATED', 'PROCESSING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKED_UP', 'DELIVERED', 'FAILED_DELIVERY', 'CANCELED'];

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800';
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
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking Number
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origin
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id + shipment.trackingNumber} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                {shipment.trackingNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.serviceType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.origin.city}, {shipment.origin.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.destination.city}, {shipment.destination.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {onUpdateStatus ? (
                  <select
                    value={shipment.status}
                    onChange={(e) => onUpdateStatus(shipment, e.target.value)}
                    className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{formatStatus(status)}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                    {formatStatus(shipment.status)}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.items.length} items
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {onViewDetails && (
                  <button 
                    onClick={() => onViewDetails(shipment)}
                    className="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    View Details
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 