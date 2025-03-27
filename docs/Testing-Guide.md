# DelhiveryOne Testing Guide

This guide provides instructions for testing the DelhiveryOne application, including unit testing, integration testing, and end-to-end testing approaches.

## Testing Philosophy

DelhiveryOne follows a testing strategy aligned with hexagonal architecture principles:

1. **Domain Testing**: Unit tests for domain models and services in isolation
2. **Adapter Testing**: Unit tests for adapters with mocked dependencies
3. **Integration Testing**: Testing interactions between components
4. **End-to-End Testing**: Testing the application as a whole

## Test Setup

### Prerequisites

- Node.js and npm installed
- All dependencies installed (`npm install`)

### Test Structure

Tests are organized to mirror the structure of the application:

```
src/
├── hexagon/
│   ├── core/
│   │   ├── domain/
│   │   │   └── __tests__/        # Domain model tests
│   │   ├── ports/
│   │   │   └── __tests__/        # Port interface tests
│   │   └── services/
│   │       └── __tests__/        # Service unit tests
│   └── adapters/
│       ├── primary/
│       │   └── __tests__/        # Primary adapter tests
│       └── secondary/
│           └── __tests__/        # Secondary adapter tests
├── ui/
│   ├── components/
│   │   └── __tests__/            # UI component tests
│   └── pages/
│       └── __tests__/            # Page component tests
└── features/
    └── __tests__/                # Feature tests
```

## Domain Layer Testing

The domain layer should be tested in isolation without dependencies on external systems.

### Domain Model Tests

Test domain models for:
- Data validation
- Business rules
- Domain behavior

Example:

```typescript
// src/hexagon/core/domain/__tests__/Shipment.test.ts
import { Shipment, ShipmentStatus } from '../Shipment';

describe('Shipment', () => {
  it('should create a valid shipment', () => {
    const shipment = new Shipment({
      id: '123',
      trackingNumber: 'TRACK123',
      status: ShipmentStatus.CREATED,
      origin: 'New York',
      destination: 'Los Angeles',
      serviceType: 'B2B',
      createdAt: new Date()
    });

    expect(shipment.id).toBe('123');
    expect(shipment.status).toBe(ShipmentStatus.CREATED);
  });

  it('should validate tracking number format', () => {
    expect(() => {
      new Shipment({
        id: '123',
        trackingNumber: 'invalid', // Invalid format
        status: ShipmentStatus.CREATED,
        origin: 'New York',
        destination: 'Los Angeles',
        serviceType: 'B2B',
        createdAt: new Date()
      });
    }).toThrow('Invalid tracking number format');
  });

  it('should allow status transition from CREATED to PROCESSING', () => {
    const shipment = new Shipment({
      id: '123',
      trackingNumber: 'TRACK123',
      status: ShipmentStatus.CREATED,
      origin: 'New York',
      destination: 'Los Angeles',
      serviceType: 'B2B',
      createdAt: new Date()
    });

    shipment.updateStatus(ShipmentStatus.PROCESSING);
    expect(shipment.status).toBe(ShipmentStatus.PROCESSING);
  });
});
```

### Service Tests

Test services with mocked repositories:

```typescript
// src/hexagon/core/services/__tests__/ShipmentService.test.ts
import { ShipmentService } from '../ShipmentService';
import { ShipmentStatus, ServiceType } from '../../domain/Shipment';

describe('ShipmentService', () => {
  // Create mock repository
  const mockShipmentRepo = {
    getShipments: jest.fn(),
    getShipmentById: jest.fn(),
    updateShipmentStatus: jest.fn()
  };

  const mockUserRepo = {
    getUserByUsername: jest.fn(),
    validateCredentials: jest.fn(),
    hasPermission: jest.fn()
  };

  let shipmentService;

  beforeEach(() => {
    jest.clearAllMocks();
    shipmentService = new ShipmentService(mockShipmentRepo, mockUserRepo);
  });

  it('should get shipments for a service type', async () => {
    // Setup mock
    const mockShipments = [
      { id: '1', serviceType: ServiceType.B2B, status: ShipmentStatus.CREATED },
      { id: '2', serviceType: ServiceType.B2B, status: ShipmentStatus.DELIVERED }
    ];
    mockShipmentRepo.getShipments.mockResolvedValue(mockShipments);

    // Call method
    const result = await shipmentService.getShipments(ServiceType.B2B);

    // Assertions
    expect(mockShipmentRepo.getShipments).toHaveBeenCalledWith(ServiceType.B2B);
    expect(result).toEqual(mockShipments);
  });

  it('should update shipment status if user has permission', async () => {
    // Setup mocks
    mockUserRepo.hasPermission.mockResolvedValue(true);
    mockShipmentRepo.updateShipmentStatus.mockResolvedValue({ 
      id: '1', 
      status: ShipmentStatus.PROCESSING 
    });

    // Call method
    const result = await shipmentService.updateShipmentStatus(
      '1', 
      ShipmentStatus.PROCESSING, 
      'admin'
    );

    // Assertions
    expect(mockUserRepo.hasPermission).toHaveBeenCalledWith(
      'admin', 
      expect.any(String), 
      'update'
    );
    expect(mockShipmentRepo.updateShipmentStatus).toHaveBeenCalledWith(
      '1', 
      ShipmentStatus.PROCESSING
    );
    expect(result.status).toBe(ShipmentStatus.PROCESSING);
  });

  it('should throw error if user does not have permission', async () => {
    // Setup mock
    mockUserRepo.hasPermission.mockResolvedValue(false);

    // Call method and expect error
    await expect(
      shipmentService.updateShipmentStatus('1', ShipmentStatus.PROCESSING, 'customer')
    ).rejects.toThrow('User does not have permission to update shipment');
    
    // Verify repository was not called
    expect(mockShipmentRepo.updateShipmentStatus).not.toHaveBeenCalled();
  });
});
```

## Adapter Testing

### Primary Adapter Tests

Test primary adapters with mocked services:

```typescript
// src/hexagon/adapters/primary/__tests__/ShipmentListingAdapter.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShipmentListingAdapter } from '../ShipmentListingAdapter';
import { ServiceType } from '../../../core/domain/ServiceType';

describe('ShipmentListingAdapter', () => {
  const mockShipmentService = {
    getShipments: jest.fn(),
    updateShipmentStatus: jest.fn(),
    getShipmentsByStatus: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render shipment listing with correct title', async () => {
    // Setup mock
    mockShipmentService.getShipments.mockResolvedValue([]);

    // Render component
    render(
      <ShipmentListingAdapter
        serviceType={ServiceType.B2B}
        shipmentService={mockShipmentService}
        title="B2B Shipments Listing"
      />
    );

    // Assertions
    expect(screen.getByText('B2B Shipments Listing')).toBeInTheDocument();
    expect(mockShipmentService.getShipments).toHaveBeenCalledWith(ServiceType.B2B);
  });

  it('should display shipments when loaded', async () => {
    // Setup mock
    const mockShipments = [
      { id: '1', trackingNumber: 'TRACK1', status: 'CREATED' },
      { id: '2', trackingNumber: 'TRACK2', status: 'PROCESSING' }
    ];
    mockShipmentService.getShipments.mockResolvedValue(mockShipments);

    // Render component
    render(
      <ShipmentListingAdapter
        serviceType={ServiceType.B2B}
        shipmentService={mockShipmentService}
        title="B2B Shipments Listing"
      />
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('TRACK1')).toBeInTheDocument();
      expect(screen.getByText('TRACK2')).toBeInTheDocument();
    });
  });

  it('should handle status update', async () => {
    // Setup mocks
    const mockShipments = [
      { id: '1', trackingNumber: 'TRACK1', status: 'CREATED' }
    ];
    mockShipmentService.getShipments.mockResolvedValue(mockShipments);
    mockShipmentService.updateShipmentStatus.mockResolvedValue({
      id: '1', 
      trackingNumber: 'TRACK1', 
      status: 'PROCESSING'
    });

    // Render component
    render(
      <ShipmentListingAdapter
        serviceType={ServiceType.B2B}
        shipmentService={mockShipmentService}
        title="B2B Shipments Listing"
      />
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('TRACK1')).toBeInTheDocument();
    });

    // Trigger status update
    fireEvent.click(screen.getByText('Update Status'));
    
    // Select new status
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'PROCESSING' }
    });
    
    fireEvent.click(screen.getByText('Confirm'));

    // Verify service was called
    await waitFor(() => {
      expect(mockShipmentService.updateShipmentStatus).toHaveBeenCalledWith(
        '1', 
        'PROCESSING',
        expect.any(String)
      );
    });
  });
});
```

### Secondary Adapter Tests

Test secondary adapters with mocked external dependencies:

```typescript
// src/hexagon/adapters/secondary/__tests__/ShipmentApiRepository.test.ts
import { ShipmentApiRepository } from '../ShipmentApiRepository';
import { ServiceType } from '../../../core/domain/ServiceType';

// Mock fetch
global.fetch = jest.fn();

describe('ShipmentApiRepository', () => {
  let repository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ShipmentApiRepository();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn()
      },
      writable: true
    });
  });

  it('should get shipments for B2B service type', async () => {
    // Setup mock response
    const mockShipments = [
      { id: '1', serviceType: 'B2B' },
      { id: '2', serviceType: 'B2B' }
    ];
    
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockShipments));

    // Call method
    const shipments = await repository.getShipments(ServiceType.B2B);

    // Assertions
    expect(window.localStorage.getItem).toHaveBeenCalledWith('shipments');
    expect(shipments.length).toBe(2);
    expect(shipments[0].serviceType).toBe('B2B');
  });

  it('should update shipment status', async () => {
    // Setup mock data
    const mockShipments = [
      { id: '1', status: 'CREATED', serviceType: 'B2B' }
    ];
    
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockShipments));
    
    // Call method
    const updatedShipment = await repository.updateShipmentStatus('1', 'PROCESSING');

    // Assertions
    expect(window.localStorage.setItem).toHaveBeenCalled();
    expect(updatedShipment.id).toBe('1');
    expect(updatedShipment.status).toBe('PROCESSING');
  });

  it('should throw error when shipment not found', async () => {
    // Setup mock data
    const mockShipments = [
      { id: '1', status: 'CREATED', serviceType: 'B2B' }
    ];
    
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockShipments));
    
    // Call method and expect error
    await expect(
      repository.updateShipmentStatus('999', 'PROCESSING')
    ).rejects.toThrow('Shipment not found');
  });
});
```

## UI Component Testing

Test UI components in isolation:

```typescript
// src/ui/components/__tests__/Navigation.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';
import { ServiceType } from '../../../hexagon/core/domain/ServiceType';

// Mock ServiceSwitcher component
jest.mock('../ServiceSwitcher', () => ({
  ServiceSwitcher: () => <div data-testid="service-switcher" />
}));

describe('Navigation', () => {
  it('renders navigation for B2B service type', () => {
    render(
      <MemoryRouter>
        <Navigation serviceType={ServiceType.B2B} />
      </MemoryRouter>
    );

    expect(screen.getByText('DelhiveryOne')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Shipments')).toBeInTheDocument();
    expect(screen.getByTestId('service-switcher')).toBeInTheDocument();
  });

  it('should have correct links for service type', () => {
    render(
      <MemoryRouter>
        <Navigation serviceType={ServiceType.B2C} />
      </MemoryRouter>
    );

    // Check Dashboard link
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/b2c');

    // Check Shipments link
    const shipmentsLink = screen.getByText('Shipments').closest('a');
    expect(shipmentsLink).toHaveAttribute('href', '/b2c/shipments');
  });
});
```

## Integration Testing

Test interactions between multiple components:

```typescript
// src/features/__tests__/B2BShipmentListingIntegration.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ShipmentListingPage } from '../b2b/ShipmentListingPage';
import { ServiceTypeProvider } from '../../hexagon/infrastructure/providers/ServiceTypeProvider';
import { ServiceType } from '../../hexagon/core/domain/ServiceType';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('B2B Shipment Listing Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Setup mock data
    const mockShipments = [
      { 
        id: '1', 
        trackingNumber: 'TRACK1', 
        status: 'CREATED',
        serviceType: 'B2B'
      },
      { 
        id: '2', 
        trackingNumber: 'TRACK2', 
        status: 'DELIVERED',
        serviceType: 'B2B'
      }
    ];
    mockLocalStorage.setItem('shipments', JSON.stringify(mockShipments));
    
    const mockUsers = [
      {
        username: 'admin',
        permissions: [
          { service: 'B2B', actions: ['create', 'view', 'update'] }
        ]
      }
    ];
    mockLocalStorage.setItem('users', JSON.stringify(mockUsers));
    mockLocalStorage.setItem('currentUser', JSON.stringify({ username: 'admin' }));
  });

  it('should render the B2B shipment listing with data', async () => {
    render(
      <MemoryRouter>
        <ServiceTypeProvider initialServiceType={ServiceType.B2B}>
          <ShipmentListingPage />
        </ServiceTypeProvider>
      </MemoryRouter>
    );

    // Wait for shipments to load
    await waitFor(() => {
      expect(screen.getByText('B2B Shipments Listing')).toBeInTheDocument();
      expect(screen.getByText('TRACK1')).toBeInTheDocument();
      expect(screen.getByText('TRACK2')).toBeInTheDocument();
      expect(screen.getByText('CREATED')).toBeInTheDocument();
      expect(screen.getByText('DELIVERED')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

End-to-end tests validate the entire application flow:

```typescript
// cypress/integration/login_and_view_shipments.spec.ts
describe('Login and View Shipments', () => {
  beforeEach(() => {
    // Clear localStorage
    cy.clearLocalStorage();
    
    // Visit the app
    cy.visit('/');
  });

  it('should login and navigate to B2B dashboard', () => {
    // Login
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // Should navigate to service selector
    cy.url().should('include', '/select-service');
    
    // Select B2B service
    cy.contains('B2B Shipping').click();
    
    // Should navigate to B2B dashboard
    cy.url().should('include', '/b2b');
    cy.contains('B2B Shipments Dashboard').should('be.visible');
    
    // Navigate to shipments
    cy.contains('Shipments').click();
    
    // Should navigate to shipments listing
    cy.url().should('include', '/b2b/shipments');
    cy.contains('B2B Shipments Listing').should('be.visible');
    
    // Should display shipments
    cy.get('table').should('be.visible');
    cy.contains('TRACK').should('be.visible');
  });

  it('should switch service type', () => {
    // Login
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // Select B2B service
    cy.contains('B2B Shipping').click();
    
    // Open service switcher
    cy.get('[data-testid="service-switcher"]').click();
    
    // Select B2C service
    cy.contains('B2C Shipping').click();
    
    // Should navigate to B2C dashboard
    cy.url().should('include', '/b2c');
    cy.contains('B2C Shipments Dashboard').should('be.visible');
  });
});
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests for a specific file
npm test -- src/hexagon/core/services/__tests__/ShipmentService.test.ts

# Run tests with coverage
npm test -- --coverage
```

### End-to-End Tests

```bash
# Open Cypress test runner
npm run cypress:open

# Run Cypress tests headless
npm run cypress:run
```

## Testing Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests
2. **Mock External Dependencies**: Use mocks for external services, APIs, and localStorage
3. **Test Business Logic Thoroughly**: Focus on domain services and business rules
4. **Test UI Behavior**: Focus on user interactions rather than implementation details
5. **Use Test-Driven Development**: Write tests before implementing features
6. **Test Error Scenarios**: Include tests for error handling and edge cases
7. **Use Testing Hooks**: Utilize React Testing Library's hooks for testing React components

## Testing Coverage Goals

- Domain Layer: 90%+ coverage
- Adapters: 80%+ coverage
- UI Components: 70%+ coverage
- End-to-End: Key user flows covered

## Conclusion

Following this testing approach ensures that DelhiveryOne remains maintainable and reliable as new features are added. The hexagonal architecture facilitates testing by separating concerns and allowing components to be tested in isolation. 