import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shipment } from '../../core/domain/Shipment';
import { ShipmentService } from '../../core/ports/input/ShipmentService';
import { usePermission } from './providers/PermissionProvider';
import { ShipmentList } from './ui/components/ShipmentList';
import InfiniteScroll from './ui/components/InfiniteScroll';

interface ShipmentListingAdapterProps {
  shipmentService: ShipmentService;
  serviceType: 'B2B' | 'B2C' | 'INTERNATIONAL';
  title: string;
}

export const ShipmentListingAdapter: React.FC<ShipmentListingAdapterProps> = ({
  shipmentService,
  serviceType,
  title
}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { hasPermission } = usePermission();
  const [canUpdateStatus, setCanUpdateStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);
  const itemsPerPage = 10;

  const loadShipments = useCallback(async (page: number, append: boolean = false) => {
    // Use ref to prevent multiple concurrent load requests
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;

      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      console.log(`Loading shipments for ${serviceType}, page ${page}, append: ${append}`);

      const response = await shipmentService.getShipmentsByServiceTypePaginated(serviceType, {
        page,
        limit: itemsPerPage
      });
      
      
      // Check permissions
      if (page === 1) {
        const canUpdate = await hasPermission('update', 'shipment');
        setCanUpdateStatus(canUpdate);
      }
      
      // Update shipments list
      setShipments(prev => append ? [...prev, ...response.data] : response.data);
      
      console.log(`Loaded ${response.data.length} shipments, hasMore: ${response.hasMore}`);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [shipmentService, serviceType, hasPermission]);

  useEffect(() => {
    // Reset state when service type changes
    setCurrentPage(1);
    setHasMore(true);
    setShipments([]);
    
    // Load first page of shipments
    loadShipments(1, false);
  }, [loadShipments, serviceType]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || isLoadingRef.current) return;
    
    const nextPage = currentPage + 1;
    console.log(`Loading more shipments, page ${nextPage}`);
    setCurrentPage(nextPage);
    loadShipments(nextPage, true);
  }, [currentPage, isLoadingMore, hasMore, loadShipments]);

  const handleUpdateStatus = async (shipment: Shipment, newStatus: string) => {
    if (!canUpdateStatus) return;
    
    try {
      await shipmentService.updateShipmentStatus(shipment.id, newStatus);
      
      // Update local state
      setShipments(prev => prev.map(s => 
        s.id === shipment.id ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      console.error('Error updating shipment status:', error);
    }
  };

  const handleViewDetails = (shipment: Shipment) => {
    console.log(`Viewing details for shipment: ${shipment.id}`);
    // In a real app, this would navigate to a details page
    alert(`Shipment Details: ${shipment.trackingNumber}\nFrom: ${shipment.origin.city}\nTo: ${shipment.destination.city}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-500">
          <span className="font-medium">API Endpoint:</span> /api/shipments/{serviceType.toLowerCase()}
        </div>
      </div>
      
      <div className="w-full">
        <InfiniteScroll
          isLoading={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        >
          <ShipmentList
            shipments={shipments}
            isLoading={isLoading}
            emptyMessage={`No ${serviceType} shipments found`}
            onViewDetails={handleViewDetails}
            onUpdateStatus={canUpdateStatus ? handleUpdateStatus : undefined}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
}; 