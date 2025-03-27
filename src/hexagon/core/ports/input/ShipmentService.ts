import { Shipment, ServiceType } from '../../domain/Shipment';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
}

export interface CreateShipmentDTO {
  serviceType: ServiceType;
  origin: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  destination: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
  }>;
}

export interface ShipmentService {
  createShipment(data: CreateShipmentDTO): Promise<Shipment>;
  getShipmentById(id: string): Promise<Shipment | null>;
  getShipmentsByServiceType(serviceType: ServiceType): Promise<Shipment[]>;
  getShipmentsByServiceTypePaginated(
    serviceType: ServiceType, 
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Shipment>>;
  updateShipmentStatus(id: string, status: string): Promise<Shipment>;
} 