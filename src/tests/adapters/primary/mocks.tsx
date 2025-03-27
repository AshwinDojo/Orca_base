import { vi } from 'vitest';
import { ServiceType, Shipment } from '../../../hexagon/core/domain/Shipment';
import { User } from '../../../hexagon/core/domain/User';
import React from 'react';

// Define interfaces for component props
interface ShipmentListProps {
  shipments: Shipment[];
  isLoading: boolean;
  emptyMessage: string;
  onViewDetails?: (shipment: Shipment) => void;
  onUpdateStatus?: (shipment: Shipment, status: string) => void;
}

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

// Mock user for testing
export const mockUser: User = {
  id: 'user1',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  roles: [
    {
      id: '1',
      name: 'ADMIN',
      permissions: [
        { id: '1', name: 'View Shipment', resource: 'shipment', action: 'read' },
        { id: '2', name: 'Update Shipment', resource: 'shipment', action: 'update' }
      ]
    }
  ]
};

// Create mock shipment functions
export function createMockShipment(id: string, serviceType: ServiceType): Shipment {
  return {
    id,
    trackingNumber: `TRK-${id}`,
    serviceType,
    status: 'IN_TRANSIT',
    origin: { 
      street: '123 Origin St', 
      city: 'Origin City', 
      state: 'OS', 
      zipCode: '12345', 
      country: 'Origin Country' 
    },
    destination: { 
      street: '456 Dest St', 
      city: 'Dest City', 
      state: 'DS', 
      zipCode: '67890', 
      country: 'Dest Country' 
    },
    items: [
      { 
        id: `item-${id}`, 
        name: 'Test Item', 
        weight: 1, 
        dimensions: { length: 10, width: 5, height: 2 }, 
        value: 100 
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function createMockShipments(serviceType: ServiceType): Shipment[] {
  return [
    createMockShipment(`${serviceType.toLowerCase()}-1`, serviceType),
    createMockShipment(`${serviceType.toLowerCase()}-2`, serviceType)
  ];
}

// Mock services
export const mockAuthService = {
  login: vi.fn().mockResolvedValue({ user: mockUser }),
  logout: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockResolvedValue(mockUser),
  hasPermission: vi.fn().mockResolvedValue(true)
};

export const mockShipmentService = {
  createShipment: vi.fn(),
  getShipmentById: vi.fn(),
  getShipmentsByServiceType: vi.fn(),
  getShipmentsByServiceTypePaginated: vi.fn().mockResolvedValue({
    data: [],
    totalCount: 0,
    hasMore: false
  }),
  updateShipmentStatus: vi.fn()
};

// Setup all mocks
export function setupMocks(): void {
  // Mock UI components
  vi.mock('../../../hexagon/adapters/primary/ui/components/ShipmentList', () => ({
    ShipmentList: ({ shipments, isLoading, emptyMessage }: ShipmentListProps) => (
      <div data-testid="shipment-list">
        {isLoading ? (
          <div data-testid="loading">Loading...</div>
        ) : shipments.length === 0 ? (
          <div data-testid="empty-message">{emptyMessage}</div>
        ) : (
          <ul>
            {shipments.map((shipment: Shipment) => (
              <li key={shipment.id} data-testid={`shipment-${shipment.id}`}>
                <span>{shipment.trackingNumber}</span>
                <span>{shipment.serviceType}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/components/InfiniteScroll', () => ({
    default: ({ children, onLoadMore }: InfiniteScrollProps) => (
      <div data-testid="infinite-scroll">
        {children}
        <button data-testid="load-more" onClick={onLoadMore}>Load More</button>
      </div>
    )
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/components/Navigation', () => ({
    Navigation: ({ serviceType }: { serviceType: ServiceType }) => (
      <nav data-testid="navigation">
        <div data-testid="current-service-type">{serviceType}</div>
      </nav>
    )
  }));

  // Mock all the UI pages
  vi.mock('../../../hexagon/adapters/primary/ui/pages/LoginPage', () => ({
    LoginPage: () => <div data-testid="login-page">Login Page</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/pages/UnauthorizedPage', () => ({
    UnauthorizedPage: () => <div data-testid="unauthorized-page">Unauthorized Page</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/pages/ServiceSelectorPage', () => ({
    ServiceSelectorPage: () => <div data-testid="service-selector-page">Select a Service</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/pages/B2BDashboard', () => ({
    B2BDashboard: () => <div data-testid="b2b-dashboard">B2B Dashboard</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/pages/B2CDashboard', () => ({
    B2CDashboard: () => <div data-testid="b2c-dashboard">B2C Dashboard</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/ui/pages/InternationalDashboard', () => ({
    InternationalDashboard: () => <div data-testid="international-dashboard">International Dashboard</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/features/b2b/ShipmentListingPage', () => ({
    B2BShipmentListingPage: () => <div data-testid="b2b-shipment-listing">B2B Shipment Listing</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/features/b2c/ShipmentListingPage', () => ({
    B2CShipmentListingPage: () => <div data-testid="b2c-shipment-listing">B2C Shipment Listing</div>
  }));

  vi.mock('../../../hexagon/adapters/primary/features/international/ShipmentListingPage', () => ({
    InternationalShipmentListingPage: () => <div data-testid="international-shipment-listing">International Shipment Listing</div>
  }));

  // Mock repositories
  vi.mock('../../../hexagon/adapters/secondary/UserLocalStorageRepository', () => ({
    UserLocalStorageRepository: vi.fn().mockImplementation(() => ({
      findUserByUsername: vi.fn().mockResolvedValue(mockUser),
      saveUser: vi.fn(),
      getStoredUser: vi.fn().mockReturnValue(mockUser),
      clearStoredUser: vi.fn()
    }))
  }));

  vi.mock('../../../hexagon/adapters/secondary/ShipmentApiRepository', () => ({
    ShipmentApiRepository: vi.fn().mockImplementation(() => ({
      findShipmentById: vi.fn(),
      findShipmentsByServiceType: vi.fn(),
      findShipmentsByServiceTypePaginated: vi.fn().mockImplementation((serviceType) => {
        const data = createMockShipments(serviceType);
        return Promise.resolve({
          data,
          totalCount: data.length,
          hasMore: false
        });
      }),
      updateShipmentStatus: vi.fn(),
      createShipment: vi.fn()
    }))
  }));

  // Mock services
  vi.mock('../../../hexagon/core/services/AuthServiceImpl', () => ({
    AuthServiceImpl: vi.fn().mockImplementation(() => mockAuthService)
  }));

  vi.mock('../../../hexagon/core/services/ShipmentServiceImpl', () => ({
    ShipmentServiceImpl: vi.fn().mockImplementation(() => mockShipmentService)
  }));
} 