import { Shipment, ServiceType } from '../../domain/Shipment';
import { PaginationParams, PaginatedResponse } from '../input/ShipmentService';

export interface ShipmentRepository {
  save(shipment: Shipment): Promise<Shipment>;
  findById(id: string): Promise<Shipment | null>;
  findByServiceType(serviceType: ServiceType): Promise<Shipment[]>;
  findByServiceTypePaginated(
    serviceType: ServiceType, 
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Shipment>>;
  update(shipment: Shipment): Promise<Shipment>;
} 