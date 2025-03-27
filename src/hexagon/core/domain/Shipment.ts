export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Item {
  id: string;
  name: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
}

export type ServiceType = 'B2B' | 'B2C' | 'INTERNATIONAL';

export interface Shipment {
  id: string;
  trackingNumber: string;
  serviceType: ServiceType;
  status: string;
  origin: Address;
  destination: Address;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
} 