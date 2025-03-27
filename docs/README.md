# DelhiveryOne Documentation

Welcome to the DelhiveryOne documentation. This directory contains comprehensive documentation for the DelhiveryOne logistics management platform.

## Table of Contents

### Architecture & Design

- [Architecture Overview](./DelhiveryOne-Architecture.md) - Comprehensive overview of the system architecture
- [Hexagonal Architecture](./Hexagonal-Architecture.md) - Detailed explanation of the hexagonal architecture pattern used

### Development Guides

- [Contributing Guide](./CONTRIBUTING.md) - Guidelines and workflows for contributing to the project
- [Adding New Service Types](./Adding-New-Service-Types.md) - Step-by-step guide for extending the platform with new service types
- [Testing Guide](./Testing-Guide.md) - Comprehensive testing strategy and examples

## Key Concepts

### Service Types

DelhiveryOne supports multiple service types (B2B, B2C, International) and is designed to be easily extended with new service types. Each service type has its own:

- Dashboard page
- Shipment listing page
- API endpoints
- Permissions model

### Hexagonal Architecture

The application follows the hexagonal architecture pattern (also known as ports and adapters):

- **Domain Core**: Contains business logic and entities
- **Ports**: Interfaces that define how the core interacts with the outside world
- **Adapters**: Implementations that connect the core to external systems
- **UI Layer**: React components that provide the user interface

This architecture enables:
- Clean separation of concerns
- Testable business logic
- Pluggable external dependencies
- Flexibility to add new features

## Getting Started

For new developers, we recommend starting with the [Architecture Overview](./DelhiveryOne-Architecture.md) to understand the high-level design, followed by the [Contributing Guide](./CONTRIBUTING.md) to learn how to set up the development environment and make changes to the codebase. 