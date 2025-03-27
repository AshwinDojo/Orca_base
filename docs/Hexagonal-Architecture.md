# Hexagonal Architecture in DelhiveryOne

This document explains the hexagonal architecture (also known as ports and adapters) implementation in the DelhiveryOne application.

## Introduction to Hexagonal Architecture

Hexagonal Architecture, proposed by Alistair Cockburn, is a software design pattern that aims to create loosely coupled application components that can be easily connected to their software environment by means of ports and adapters. This makes components exchangeable at any level and facilitates test automation.

## Core Principles

The main principles of hexagonal architecture are:

1. **Separation of concerns**: Isolate the domain logic from external concerns
2. **Dependency rule**: Dependencies always point inward
3. **Ports as interfaces**: Domain defines ports (interfaces) that outside layers implement
4. **Adapters as implementations**: Adapters implement the interfaces defined by the ports

## DelhiveryOne Architecture Layers

### 1. Domain Layer (Core)

The innermost layer contains the business logic and domain models. It defines what the application is about.

#### Location in codebase: `src/hexagon/core`

- **Domain Models**: `src/hexagon/core/domain`
  - Business entities that represent the core concepts
  - No dependencies on external frameworks or libraries
  - Examples: `Shipment.ts`, `User.ts`, `ServiceType.ts`

- **Ports**: `src/hexagon/core/ports`
  - Interfaces that define how the core interacts with the outside world
  - Input ports (primary): `src/hexagon/core/ports/input`
    - Define how the UI can interact with the domain
    - Examples: `ShipmentServicePort.ts`, `AuthServicePort.ts`
  - Output ports (secondary): `src/hexagon/core/ports/output`
    - Define how the domain interacts with external resources
    - Examples: `ShipmentRepositoryPort.ts`, `UserRepositoryPort.ts`

- **Services**: `src/hexagon/core/services`
  - Implementation of business logic
  - Use cases implementation
  - Examples: `ShipmentService.ts`, `AuthService.ts`

### 2. Adapters Layer

The middle layer contains adapters that connect the domain to the outside world.

#### Primary Adapters (Driving/UI Adapters)

Primary adapters convert external input to a format that the domain can understand and process.

#### Location in codebase: `src/hexagon/adapters/primary`

- Examples: 
  - `ShipmentDashboardAdapter.tsx`
  - `ShipmentListingAdapter.tsx`
  - `AuthAdapter.tsx`

#### Secondary Adapters (Driven/Infrastructure Adapters)

Secondary adapters implement output ports and connect the domain to external resources.

#### Location in codebase: `src/hexagon/adapters/secondary`

- Examples:
  - `ShipmentApiRepository.ts`
  - `UserLocalStorageRepository.ts`

### 3. UI Layer (Applications Layer)

The outermost layer contains UI components and frameworks.

#### Location in codebase: `src/ui` and `src/features`

- **UI Components**: `src/ui/components`
  - Reusable UI components
  - Examples: `Navigation.tsx`, `ShipmentList.tsx`, `ServiceSwitcher.tsx`

- **Pages**: `src/ui/pages`
  - Page-level components
  - Examples: `LoginPage.tsx`, `B2BDashboard.tsx`, `ServiceSelectorPage.tsx`

- **Features**: `src/features`
  - Feature-specific components
  - Examples: `b2b/ShipmentListingPage.tsx`, `b2c/ShipmentListingPage.tsx`

## Flow of Control

1. UI components (React components) use primary adapters
2. Primary adapters call domain services through ports
3. Domain services implement business logic
4. Domain services use secondary adapters through ports
5. Secondary adapters interact with external systems

## Dependency Injection

Dependency injection is used to provide implementations of ports to the domain services:

- `ServiceTypeProvider.tsx`: Provides service implementations based on the selected service type
- Adapters are injected into services at runtime

## Benefits of Hexagonal Architecture in DelhiveryOne

1. **Testability**: The domain can be tested in isolation
2. **Flexibility**: Easy to swap out UI frameworks or data sources
3. **Maintainability**: Clear separation of concerns makes the codebase easier to understand
4. **Scalability**: New service types can be added with minimal changes to the core
5. **Framework Independence**: The domain is not tied to any specific framework

## Example: Adding a New Service Type

When adding a new service type to DelhiveryOne, the hexagonal architecture allows for minimal changes:

1. Add the new service type to the domain model (`ServiceType.ts`)
2. No changes needed to existing domain services or ports
3. Create or extend adapters to handle the new service type
4. Create UI components that use the existing adapters

## Example: Flow of Data for Displaying Shipments

1. UI component (`B2BDashboard.tsx`) renders the `ShipmentDashboardAdapter`
2. `ShipmentDashboardAdapter` calls the `ShipmentService` through the `ShipmentServicePort`
3. `ShipmentService` implements business logic and calls the repository through the `ShipmentRepositoryPort`
4. `ShipmentApiRepository` implements the `ShipmentRepositoryPort` and fetches data from the API
5. Data flows back through the layers to be displayed in the UI

## Conclusion

Hexagonal architecture provides DelhiveryOne with a maintainable and extensible codebase. The clear separation of concerns allows for easy addition of new features and service types while maintaining the integrity of the domain logic. 