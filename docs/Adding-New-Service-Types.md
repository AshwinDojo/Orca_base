# Adding New Service Types to DelhiveryOne

This guide provides detailed steps for extending the DelhiveryOne platform with new service types.

## Overview

DelhiveryOne is designed to be easily extensible. Adding a new service type requires changes in several areas of the application:

1. Domain models
2. UI components
3. Routing configuration
4. Service providers
5. Repository implementations
6. Mock data generation

## Step-by-Step Guide

### 1. Update Domain Models

First, modify the `ServiceType` enum to include your new service type:

```typescript
// src/hexagon/core/domain/ServiceType.ts
export enum ServiceType {
  B2B = "B2B",
  B2C = "B2C",
  INTERNATIONAL = "INTERNATIONAL",
  NEW_SERVICE = "NEW_SERVICE" // Add your new service here
}
```

### 2. Create Dashboard and Listing Pages

#### Dashboard Page

Create a new dashboard page for your service:

```typescript
// src/ui/pages/NewServiceDashboard.tsx
import React from "react";
import { Navigation } from "../../ui/components/Navigation";
import { ShipmentDashboardAdapter } from "../../hexagon/adapters/primary/ShipmentDashboardAdapter";
import { useServiceType } from "../../hexagon/infrastructure/providers/ServiceTypeProvider";

export const NewServiceDashboard: React.FC = () => {
  const { serviceType, shipmentService } = useServiceType();

  return (
    <div className="dashboard-container">
      <Navigation serviceType={serviceType} />
      <div className="dashboard-content">
        <h1>{serviceType} Shipments Dashboard</h1>
        <ShipmentDashboardAdapter 
          serviceType={serviceType} 
          shipmentService={shipmentService} 
        />
      </div>
    </div>
  );
};
```

#### Shipment Listing Page

Create a new shipment listing page for your service:

```typescript
// src/features/new-service/ShipmentListingPage.tsx
import React from "react";
import { Navigation } from "../../ui/components/Navigation";
import { ShipmentListingAdapter } from "../../hexagon/adapters/primary/ShipmentListingAdapter";
import { useServiceType } from "../../hexagon/infrastructure/providers/ServiceTypeProvider";

export const ShipmentListingPage: React.FC = () => {
  const { serviceType, shipmentService } = useServiceType();

  return (
    <div className="dashboard-container">
      <Navigation serviceType={serviceType} />
      <div className="dashboard-content">
        <ShipmentListingAdapter
          serviceType={serviceType}
          shipmentService={shipmentService}
          title={`${serviceType} Shipments Listing`}
        />
      </div>
    </div>
  );
};
```

### 3. Update Routing Configuration

Add routes for your new service in the app router:

```typescript
// src/App.tsx
// ... existing imports
import { NewServiceDashboard } from './ui/pages/NewServiceDashboard';
import { ShipmentListingPage as NewServiceShipmentListingPage } from './features/new-service/ShipmentListingPage';

function App() {
  return (
    <Router>
      <Routes>
        // ... existing routes
        <Route path="/new-service" element={
          <ProtectedRoute>
            <ServiceTypeProvider initialServiceType={ServiceType.NEW_SERVICE}>
              <NewServiceDashboard />
            </ServiceTypeProvider>
          </ProtectedRoute>
        } />
        <Route path="/new-service/shipments" element={
          <ProtectedRoute>
            <ServiceTypeProvider initialServiceType={ServiceType.NEW_SERVICE}>
              <NewServiceShipmentListingPage />
            </ServiceTypeProvider>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
```

### 4. Update Service Type Provider

If your new service requires specific configuration, update the `ServiceTypeProvider` to handle it:

```typescript
// src/hexagon/infrastructure/providers/ServiceTypeProvider.tsx
// ... existing code

const getShipmentServiceForType = (serviceType: ServiceType): ShipmentServicePort => {
  switch (serviceType) {
    // ... existing cases
    case ServiceType.NEW_SERVICE:
      return new ShipmentService(
        new ShipmentApiRepository(serviceType),
        new UserLocalStorageRepository()
      );
    default:
      return new ShipmentService(
        new ShipmentApiRepository(ServiceType.B2B),
        new UserLocalStorageRepository()
      );
  }
};

// ... rest of the provider
```

### 5. Update Navigation Component

Add your new service to the navigation menu:

```typescript
// src/ui/components/Navigation.tsx
// ... existing code

export const Navigation: React.FC<NavigationProps> = ({ serviceType }) => {
  // ... existing code
  
  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>DelhiveryOne</h2>
        <ServiceSwitcher />
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to={`/${serviceType.toLowerCase()}`} className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to={`/${serviceType.toLowerCase()}/shipments`} className={({ isActive }) => isActive ? 'active' : ''}>
            Shipments
          </NavLink>
        </li>
        {/* Add any service-specific navigation items here */}
        {serviceType === ServiceType.NEW_SERVICE && (
          <li>
            <NavLink to={`/${serviceType.toLowerCase()}/special-feature`} className={({ isActive }) => isActive ? 'active' : ''}>
              Special Feature
            </NavLink>
          </li>
        )}
      </ul>
      {/* ... existing logout button */}
    </nav>
  );
};
```

### 6. Update Service Selector Page

Add your new service to the service selector:

```typescript
// src/ui/pages/ServiceSelectorPage.tsx
// ... existing code

export const ServiceSelectorPage: React.FC = () => {
  // ... existing code

  const serviceOptions = [
    // ... existing options
    {
      id: ServiceType.NEW_SERVICE,
      name: "New Service",
      description: "Description of your new service",
      icon: "📦", // Choose an appropriate icon
      path: "/new-service",
    },
  ].filter(service => {
    // Filter based on user permissions if needed
    return hasPermission(currentUser, service.id);
  });

  // ... rest of the component
};
```

### 7. Update Mock Data Generation

Update the mock data generator to include data for your new service:

```typescript
// src/mock-data/generateMockData.ts
// ... existing code

export const generateMockData = () => {
  // ... existing code
  
  // Generate shipments for the new service type
  const newServiceShipments = generateRandomShipments(10, ServiceType.NEW_SERVICE);
  
  // Save to localStorage
  localStorage.setItem(
    'shipments',
    JSON.stringify([
      ...b2bShipments,
      ...b2cShipments,
      ...internationalShipments,
      ...newServiceShipments
    ])
  );
  
  // ... rest of the function
};
```

### 8. Add Permission for the New Service

Update the user permission logic to handle your new service:

```typescript
// src/hexagon/adapters/secondary/UserLocalStorageRepository.ts
// ... in the initializeUsers method

private initializeUsers(): void {
  const users = [
    {
      username: "admin",
      password: "password",
      permissions: [
        // ... existing permissions
        { service: ServiceType.NEW_SERVICE, actions: ["create", "view", "update"] }
      ]
    },
    // ... update other user types as needed
  ];
  
  localStorage.setItem("users", JSON.stringify(users));
}
```

## Testing Your New Service

1. Reset the application state (clear localStorage)
2. Log in with an account that has permissions for your new service
3. Verify that your service appears in the service selector
4. Navigate to the dashboard and shipment listing pages
5. Verify that data is loading correctly
6. Test any service-specific functionality

## Best Practices

- Follow the existing naming conventions and architecture patterns
- Reuse existing adapters and components where possible
- Keep service-specific logic in the features directory
- Ensure proper error handling for your service
- Add appropriate validations for service-specific data

By following these steps, you can seamlessly integrate a new service type into the DelhiveryOne platform while maintaining the architectural integrity of the application. 