import { Shipment, ServiceType } from '../../core/domain/Shipment';
import { ShipmentRepository } from '../../core/ports/output/ShipmentRepository';
import { PaginationParams, PaginatedResponse } from '../../core/ports/input/ShipmentService';

export class ShipmentLocalStorageRepository implements ShipmentRepository {
  private readonly storageKey = 'logistics_shipments';

  private getShipments(): Shipment[] {
    const shipments = localStorage.getItem(this.storageKey);
    return shipments ? JSON.parse(shipments) : [];
  }

  private saveShipments(shipments: Shipment[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(shipments));
  }

  async save(shipment: Shipment): Promise<Shipment> {
    const shipments = this.getShipments();
    shipments.push(shipment);
    this.saveShipments(shipments);
    return shipment;
  }

  async findById(id: string): Promise<Shipment | null> {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === id);
    return shipment || null;
  }

  async findByServiceType(serviceType: ServiceType): Promise<Shipment[]> {
    const shipments = this.getShipments();
    return shipments.filter(s => s.serviceType === serviceType);
  }

  async findByServiceTypePaginated(
    serviceType: ServiceType, 
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Shipment>> {
    const allShipments = this.getShipments().filter(s => s.serviceType === serviceType);
    
    // Calculate start and end indices for the current page
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    
    // Get the shipments for the current page
    const paginatedShipments = allShipments.slice(startIndex, endIndex);
    
    // Calculate if there are more pages
    const hasMore = endIndex < allShipments.length;
    
    return {
      data: paginatedShipments,
      totalCount: allShipments.length,
      hasMore
    };
  }

  async update(shipment: Shipment): Promise<Shipment> {
    const shipments = this.getShipments();
    const index = shipments.findIndex(s => s.id === shipment.id);
    
    if (index === -1) {
      throw new Error(`Shipment with id ${shipment.id} not found`);
    }
    
    shipments[index] = shipment;
    this.saveShipments(shipments);
    return shipment;
  }
} 