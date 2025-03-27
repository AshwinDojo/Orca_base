import { Shipment, ServiceType } from '../hexagon/core/domain/Shipment';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Helper function to generate a random tracking number
const generateTrackingNumber = (prefix: string): string => {
  const randomPart = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${randomPart}`;
};

// Helper to get random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate random shipment data for a specific service type
const generateShipmentsForServiceType = (
  count: number, 
  serviceType: ServiceType,
  origins: Address[],
  destinations: Address[]
): Shipment[] => {
  const statuses = ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY'];
  const prefix = serviceType === 'B2B' ? 'B2B' : serviceType === 'B2C' ? 'B2C' : 'INT';
  
  const generateItems = (count: number) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: crypto.randomUUID(),
        name: `Item ${i + 1}`,
        weight: Math.random() * 20 + 0.1, // 0.1kg to 20.1kg
        dimensions: {
          length: Math.random() * 50 + 5, // 5cm to 55cm
          width: Math.random() * 40 + 5,  // 5cm to 45cm
          height: Math.random() * 30 + 5, // 5cm to 35cm
        },
        value: Math.random() * 1000 + 10, // $10 to $1010
      });
    }
    return items;
  };

  const shipments: Shipment[] = [];
  
  for (let i = 0; i < count; i++) {
    const itemCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
    
    shipments.push({
      id: crypto.randomUUID(),
      trackingNumber: generateTrackingNumber(prefix),
      serviceType,
      status: getRandomItem(statuses),
      origin: getRandomItem(origins),
      destination: getRandomItem(destinations),
      items: generateItems(itemCount),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in the last 30 days
      updatedAt: new Date(),
    });
  }
  
  return shipments;
};

// Generate random shipment data for different service types
export const generateMockShipments = (): Shipment[] => {
  const origins: Address[] = [
    { street: '123 Industrial Blvd', city: 'Delhi', state: 'Delhi', zipCode: '110001', country: 'India' },
    { street: '456 Business Park', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001', country: 'India' },
    { street: '789 Tech Center', city: 'Bangalore', state: 'Karnataka', zipCode: '560001', country: 'India' },
    { street: '101 Logistics Hub', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380001', country: 'India' },
    { street: '202 Shipping Center', city: 'Jaipur', state: 'Rajasthan', zipCode: '302001', country: 'India' },
  ];
  
  const domesticDestinations: Address[] = [
    { street: '101 Main St', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001', country: 'India' },
    { street: '202 Market Rd', city: 'Kolkata', state: 'West Bengal', zipCode: '700001', country: 'India' },
    { street: '303 Retail Ave', city: 'Hyderabad', state: 'Telangana', zipCode: '500001', country: 'India' },
    { street: '404 Commercial Blvd', city: 'Pune', state: 'Maharashtra', zipCode: '411001', country: 'India' },
    { street: '505 Shopping Lane', city: 'Lucknow', state: 'Uttar Pradesh', zipCode: '226001', country: 'India' },
  ];
  
  const internationalDestinations: Address[] = [
    { street: '111 Broadway', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    { street: '222 Oxford St', city: 'London', state: 'England', zipCode: 'W1D 1BS', country: 'UK' },
    { street: '333 Orchard Rd', city: 'Singapore', state: 'Singapore', zipCode: '238867', country: 'Singapore' },
    { street: '444 King George St', city: 'Sydney', state: 'NSW', zipCode: '2000', country: 'Australia' },
    { street: '555 Ginza', city: 'Tokyo', state: 'Tokyo', zipCode: '104-0061', country: 'Japan' },
  ];
  
  // Generate more shipments for each type
  const b2bShipments = generateShipmentsForServiceType(30, 'B2B', origins, domesticDestinations);
  const b2cShipments = generateShipmentsForServiceType(35, 'B2C', origins, domesticDestinations);
  const internationalShipments = generateShipmentsForServiceType(25, 'INTERNATIONAL', origins, internationalDestinations);
  
  // Combine all shipments
  return [...b2bShipments, ...b2cShipments, ...internationalShipments];
};

// Generate and store mock data in localStorage
export const initializeMockData = () => {
  // Clear existing data
  localStorage.removeItem('logistics_shipments_api');
  
  // Generate 90 shipments (30 B2B, 35 B2C, 25 International)
  const mockShipments = generateMockShipments();
  
  // Save to local storage
  localStorage.setItem('logistics_shipments_api', JSON.stringify(mockShipments));
  
  console.log(`Mock data initialized with ${mockShipments.length} shipments for API demo`);
}; 