import { Shipment, ServiceType } from '../domain/Shipment';
import { 
  ShipmentService, 
  CreateShipmentDTO, 
  PaginationParams, 
  PaginatedResponse 
} from '../ports/input/ShipmentService';
import { ShipmentRepository } from '../ports/output/ShipmentRepository';

export class ShipmentServiceImpl implements ShipmentService {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async createShipment(data: CreateShipmentDTO): Promise<Shipment> {
    const shipment: Shipment = {
      id: crypto.randomUUID(),
      trackingNumber: this.generateTrackingNumber(),
      serviceType: data.serviceType,
      status: 'CREATED',
      origin: data.origin,
      destination: data.destination,
      items: data.items.map(item => ({
        id: crypto.randomUUID(),
        ...item
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.shipmentRepository.save(shipment);
  }

  async getShipmentById(id: string): Promise<Shipment | null> {
    return this.shipmentRepository.findById(id);
  }

  async getShipmentsByServiceType(serviceType: ServiceType): Promise<Shipment[]> {
    return this.shipmentRepository.findByServiceType(serviceType);
  }

  async getShipmentsByServiceTypePaginated(
    serviceType: ServiceType, 
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Shipment>> {
    return this.shipmentRepository.findByServiceTypePaginated(serviceType, pagination);
  }

  async updateShipmentStatus(id: string, status: string): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findById(id);
    
    if (!shipment) {
      throw new Error(`Shipment with id ${id} not found`);
    }

    shipment.status = status;
    shipment.updatedAt = new Date();

    return this.shipmentRepository.update(shipment);
  }

  private generateTrackingNumber(): string {
    const prefix = 'DEL';
    const randomPart = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${prefix}${randomPart}`;
  }
} 