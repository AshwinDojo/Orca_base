# DelhiveryOne Architecture - Scoping Document

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DelhiveryOne System                       │
│                                                                  │
│  ┌─────────────┐        ┌───────────────┐       ┌────────────┐  │
│  │    UI       │        │ Application   │       │  Domain    │  │
│  │   Layer     │◄──────►│    Layer      │◄─────►│   Layer    │  │
│  │             │        │ (Hexagon)     │       │            │  │
│  └─────────────┘        └───────────────┘       └────────────┘  │
│        ▲                        ▲                     ▲         │
│        │                        │                     │         │
│        ▼                        ▼                     ▼         │
│  ┌─────────────┐        ┌───────────────┐       ┌────────────┐  │
│  │  Primary    │        │   Service     │       │ Secondary   │  │
│  │  Adapters   │◄──────►│   Providers   │◄─────►│  Adapters   │  │
│  │             │        │               │       │             │  │
│  └─────────────┘        └───────────────┘       └────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. System Overview

DelhiveryOne is a logistics management platform built on hexagonal architecture principles, enabling flexible service types (B2B, B2C, International) with clean separation of concerns. The architecture follows the ports and adapters pattern to ensure:

1. **Business Logic Isolation**: Core business rules are independent of UI and external systems
2. **Pluggable Components**: UI and infrastructure can be changed without affecting business logic
3. **Testability**: Business logic can be tested in isolation
4. **Service Type Independence**: Each service type uses the same core components but with different configurations

## 3. Hexagonal Architecture Detail

```
                          ┌──────────────────────────────────┐
                          │          Domain Core             │
                          │                                  │
                          │  ┌───────────┐   ┌───────────┐   │
                          │  │  Entities │   │ Services  │   │
                          │  └───────────┘   └───────────┘   │
                          │         │             │          │
                          │         ▼             ▼          │
                          │  ┌────────────────────────────┐  │
                          │  │          Ports             │  │
                          │  └────────────────────────────┘  │
                          └──────────────────┬───────────────┘
                                             │
                 ┌───────────────────────────┼───────────────────────────┐
                 │                           │                           │
                 ▼                           │                           ▼
       ┌─────────────────────┐              │              ┌─────────────────────┐
       │   Primary Adapters   │              │              │  Secondary Adapters  │
       │ (Input/Driving Side) │◄─────────────┼─────────────►│ (Output/Driven Side) │
       └─────────────────────┘              │              └─────────────────────┘
                 ▲                           │                           ▲
                 │                           │                           │
        ┌────────┴────────┐                 │                ┌──────────┴───────┐
        │                 │                 │                │                   │
        ▼                 ▼                 ▼                ▼                   ▼
┌───────────────┐ ┌───────────────┐ ┌──────────────┐ ┌─────────────┐  ┌──────────────┐
│ UI Components │ │ Web Interface │ │Service Type  │ │ API Client  │  │ Local Storage │
│               │ │               │ │ Provider    │ │             │  │               │
└───────────────┘ └───────────────┘ └──────────────┘ └─────────────┘  └──────────────┘
```

## 4. Service Type Integration

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              Service Flow                                      │
│                                                                                │
│  ┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐       │
│  │  Login &  │      │  Service  │      │ Dashboard │      │ Shipment  │       │
│  │Permission │─────►│ Selection │─────►│   View    │─────►│  Listing  │       │
│  │  Check    │      │           │      │           │      │           │       │
│  └───────────┘      └───────────┘      └───────────┘      └───────────┘       │
│                           │                  ▲                  ▲              │
│                           │                  │                  │              │
│                           └──────────────────┼──────────────────┘              │
│                                              │                                 │
│                                      ┌───────────────┐                         │
│                                      │ Service Type  │                         │
│                                      │   Provider    │                         │
│                                      └───────────────┘                         │
│                                              ▲                                 │
│                                              │                                 │
│           ┌───────────────┬──────────────────┼───────────────┐                │
│           │               │                  │               │                │
│           ▼               ▼                  ▼               ▼                │
│    ┌─────────────┐ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│    │    B2B      │ │    B2C      │  │International│  │  Future     │         │
│    │  Service    │ │  Service    │  │  Service    │  │ Service     │         │
│    └─────────────┘ └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────────────────────────────────────────────────────────────────────┘
```

## 5. Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Relationships                   │
│                                                              │
│  ┌───────────────┐                     ┌───────────────┐     │
│  │ UI Components │                     │ Feature Pages │     │
│  │               │◄───────────────────►│               │     │
│  └───────┬───────┘                     └───────┬───────┘     │
│          │                                     │             │
│          │                                     │             │
│          ▼                                     ▼             │
│  ┌───────────────┐                     ┌───────────────┐     │
│  │   Primary     │                     │  Navigation   │     │
│  │   Adapters    │◄───────────────────►│  Components   │     │
│  └───────┬───────┘                     └───────────────┘     │
│          │                                                   │
│          │                                                   │
│          ▼                                                   │
│  ┌───────────────┐                     ┌───────────────┐     │
│  │ Business      │                     │  Secondary    │     │
│  │ Services      │◄───────────────────►│  Adapters     │     │
│  └───────┬───────┘                     └───────┬───────┘     │
│          │                                     │             │
│          │                                     │             │
│          ▼                                     ▼             │
│  ┌───────────────┐                     ┌───────────────┐     │
│  │   Domain      │                     │  External     │     │
│  │   Models      │                     │  APIs         │     │
│  └───────────────┘                     └───────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 6. Extending with New Services

Adding a new service type (e.g., Warehousing) requires minimal changes:

1. **Domain Layer**: 
   - Add new service type to ServiceType enum
   - No changes to core business logic 

2. **UI Layer**:
   - Create new dashboard page 
   - Create new shipment listing page
   - Update service selector to include the new option

3. **Adapters**:
   - No changes required to primary adapters
   - Add new API endpoint in repository implementation

4. **App Configuration**:
   - Add route and provider for new service type
   - Create service instance with repository

```
┌─────────────────────────────────────────────────────────────┐
│              Adding a New Service Type                       │
│                                                              │
│  Step 1: Add to ServiceType enum                             │
│  │                                                           │
│  │  export type ServiceType = 'B2B' | 'B2C' |                │
│  │               'INTERNATIONAL' | 'NEW_SERVICE';            │
│  │                                                           │
│  ├───────────────────────────────────────────────────────   │
│  │                                                           │
│  │  Step 2: Add API endpoint in ShipmentApiRepository        │
│  │                                                           │
│  │  case 'NEW_SERVICE':                                      │
│  │    return 'https://api.delhiveryone.com/new-service/...  │
│  │                                                           │
│  ├───────────────────────────────────────────────────────   │
│  │                                                           │
│  │  Step 3: Create service page components                   │
│  │     - NewServiceDashboard.tsx                             │
│  │     - NewServiceShipmentListingPage.tsx                   │
│  │                                                           │
│  ├───────────────────────────────────────────────────────   │
│  │                                                           │
│  │  Step 4: Add routes in App.tsx                            │
│  │     <Route path="/new-service" element={...} />           │
│  │     <Route path="/new-service/shipments" element={...} /> │
│  │                                                           │
│  └───────────────────────────────────────────────────────   │
└─────────────────────────────────────────────────────────────┘
```

## 7. Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                           Data Flow Diagram                             │
│                                                                         │
│  ┌────────┐     ┌────────┐      ┌────────┐      ┌────────┐             │
│  │        │     │        │      │        │      │        │             │
│  │  User  │────►│   UI   │─────►│Primary │─────►│Services│             │
│  │        │     │        │      │Adapters│      │        │             │
│  └────────┘     └────────┘      └────────┘      └────────┘             │
│                      ▲               ▲               │                  │
│                      │               │               │                  │
│                      │               │               ▼                  │
│                      │               │           ┌────────┐     ┌─────┐ │
│                      │               │           │        │     │     │ │
│                      └───────────────┼───────────│ Domain │     │ DB/ │ │
│                                      │           │ Models │     │ API │ │
│                                      │           │        │     │     │ │
│                                      │           └────────┘     └─────┘ │
│                                      │                │            ▲    │
│                                      │                │            │    │
│                                      │                ▼            │    │
│                                      │           ┌──────────┐      │    │
│                                      │           │          │      │    │
│                                      └───────────│Secondary │──────┘    │
│                                                  │ Adapters │           │
│                                                  │          │           │
│                                                  └──────────┘           │
└────────────────────────────────────────────────────────────────────────┘
```

## 8. Technical Architecture Details

### 8.1 Core Domain Model

- **Entities**:
  - Shipment
  - User
  - Permissions
  - ServiceType

- **Value Objects**:
  - Address
  - Item
  - TrackingInfo

- **Services**:
  - ShipmentService
  - AuthService

### 8.2 Ports (Interfaces)

- **Input Ports**:
  - ShipmentService
  - AuthService

- **Output Ports**:
  - ShipmentRepository
  - UserRepository

### 8.3 Primary Adapters

- **ShipmentListingAdapter**: Presents shipment listings for any service type
- **ShipmentDashboardAdapter**: Presents dashboard data for any service type
- **Navigation Component**: Adapts menu options based on service type

### 8.4 Secondary Adapters

- **ShipmentApiRepository**: Connects to service-specific API endpoints
- **ShipmentLocalStorageRepository**: For offline/demo operation
- **UserLocalStorageRepository**: User authentication and permissions

### 8.5 Providers

- **ServiceTypeProvider**: Context provider for service type and services
- **PermissionProvider**: Context provider for user permissions

## 9. Advantages & Benefits

1. **Service Type Independence**:
   - Each service type can have unique business rules without code duplication
   - Service types can be added/removed without affecting others

2. **Clean Architecture**:
   - Business logic is isolated from UI and infrastructure
   - Components are testable in isolation

3. **Unified UI Experience**:
   - Common UI components across service types
   - Consistent user experience

4. **Future Expansion**:
   - New service types can be added with minimal changes
   - New features can be added without restructuring

## 10. Future Enhancements

1. **Dynamic Service Type Discovery**:
   - Service types could be fetched from an API rather than hardcoded
   - Service-specific configurations could be dynamic

2. **Custom Views Per Service**:
   - Allow service-specific UI customizations while maintaining common components

3. **Multiple Storage Options**:
   - Add more secondary adapters for different storage/API options
   - Support for offline-first operation

4. **Advanced Permission System**:
   - More granular permissions per service type
   - Role-based access control with inheritance

## 11. Implementation Roadmap

1. **Phase 1**: Core architecture and basic services ✓
2. **Phase 2**: Advanced features and UI refinements
3. **Phase 3**: Performance optimization and scalability
4. **Phase 4**: New service type integration
5. **Phase 5**: Enterprise features and integrations

## 12. Conclusion

The DelhiveryOne platform demonstrates how hexagonal architecture enables a flexible, maintainable logistics system that can easily adapt to new business requirements. By separating core business logic from infrastructure and UI concerns, we've created a system that can evolve with minimal friction. 