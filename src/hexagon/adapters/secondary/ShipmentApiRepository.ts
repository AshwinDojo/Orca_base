import { Shipment, ServiceType } from '../../core/domain/Shipment';
import { ShipmentRepository } from '../../core/ports/output/ShipmentRepository';
import { PaginationParams, PaginatedResponse } from '../../core/ports/input/ShipmentService';
import { initializeMockData } from '../../../mock-data/generateMockData';

export class ShipmentApiRepository implements ShipmentRepository {
  constructor() {
    // Always reset data for demo purposes
    this.resetData();
  }

  // Reset data for demo
  private resetData(): void {
    // Initialize mock data
    initializeMockData();
    console.log('ShipmentApiRepository initialized with fresh data');
  }

  private getApiEndpoint(serviceType: ServiceType): string {
    // Different endpoints for different service types
    switch (serviceType) {
      case 'B2B':
        return 'https://api.delhiveryone.com/b2b/shipments';
      case 'B2C':
        return 'https://api.delhiveryone.com/b2c/shipments';
      case 'INTERNATIONAL':
        return 'https://api.delhiveryone.com/international/shipments';
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }
  
  // For demo purposes, we'll simulate API calls but use localStorage
  private readonly storageKey = 'logistics_shipments_api';

  private getShipments(): Shipment[] {
    const shipments = localStorage.getItem(this.storageKey);
    return shipments ? JSON.parse(shipments) : [];
  }

  private saveShipments(shipments: Shipment[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(shipments));
  }

  async save(shipment: Shipment): Promise<Shipment> {
    console.log(`[API] POST ${this.getApiEndpoint(shipment.serviceType)}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const shipments = this.getShipments();
    shipments.push(shipment);
    this.saveShipments(shipments);
    
    return shipment;
  }

  async findById(id: string): Promise<Shipment | null> {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === id);
    
    if (shipment) {
      console.log(`[API] GET ${this.getApiEndpoint(shipment.serviceType)}/${id}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return shipment || null;
  }

  async findByServiceType(serviceType: ServiceType): Promise<Shipment[]> {
    console.log(`[API] GET ${this.getApiEndpoint(serviceType)}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const shipments = this.getShipments();
    return shipments.filter(s => s.serviceType === serviceType);
  }

  async findByServiceTypePaginated(
    serviceType: ServiceType, 
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Shipment>> {
    console.log(`[API] GET ${this.getApiEndpoint(serviceType)}?page=${pagination.page}&limit=${pagination.limit}`);
    
    // Simulate API call delay - with progressively increasing delay for each page to make infinite scroll more noticeable
    const baseDelay = pagination.page === 1 ? 500 : 300;
    const additionalDelay = Math.min((pagination.page - 1) * 100, 700); // Cap at 700ms additional delay
    await new Promise(resolve => setTimeout(resolve, baseDelay + additionalDelay));
    
    const allShipments = this.getShipments().filter(s => s.serviceType === serviceType);
    
    // Calculate start and end indices for the current page
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    
    // Get the shipments for the current page
    const paginatedShipments = allShipments.slice(startIndex, endIndex);
    
    // Calculate if there are more pages
    const hasMore = endIndex < allShipments.length;
    
    console.log(`Returning ${paginatedShipments.length} shipments for page ${pagination.page}, hasMore: ${hasMore}`);
    
    return {
      data: paginatedShipments,
      totalCount: allShipments.length,
      hasMore
    };
  }

  async update(shipment: Shipment): Promise<Shipment> {
    console.log(`[API] PUT ${this.getApiEndpoint(shipment.serviceType)}/${shipment.id}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
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