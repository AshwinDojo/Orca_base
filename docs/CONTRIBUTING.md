# Contributing to DelhiveryOne

Thank you for your interest in contributing to DelhiveryOne! This document provides guidelines and workflows for contributing to the project.

## Development Workflow

1. **Fork and Clone**: Fork the repository and clone it locally
2. **Install Dependencies**: Run `npm install` to install all dependencies
3. **Create a Branch**: Create a new branch for your feature or bug fix
4. **Make Changes**: Implement your changes following the project's architecture
5. **Test Your Changes**: Ensure your changes don't break existing functionality
6. **Submit a Pull Request**: Push your changes and submit a pull request

## Architecture Guidelines

When contributing to DelhiveryOne, please adhere to the hexagonal architecture pattern:

1. **Domain Layer**: 
   - Add business entities in `src/hexagon/core/domain/`
   - Define interface contracts in `src/hexagon/core/ports/`
   - Implement business logic in `src/hexagon/core/services/`

2. **Adapters**:
   - UI-facing adapters go in `src/hexagon/adapters/primary/`
   - External system adapters go in `src/hexagon/adapters/secondary/`

3. **UI Components**:
   - Reusable UI components go in `src/ui/components/`
   - Page components go in `src/ui/pages/`
   - Feature-specific components go in `src/features/{feature-name}/`

## Adding a New Service Type

To add a new service type to the application:

1. **Update Domain Models**: Modify `ServiceType` enum in the domain layer
2. **Add UI Components**: Create dashboard and listing pages for the new service
3. **Update Providers**: Add the new service to the service type provider
4. **Update Repositories**: Ensure repositories support the new service type
5. **Add Navigation**: Update the navigation component to include the new service
6. **Add Routes**: Update routing to include the new service pages

## Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks for React components
- Keep components small and focused on a single responsibility
- Use the dependency injection pattern for services
- Write clear and concise comments when needed

## Testing

- Add tests for new features
- Ensure existing tests pass with your changes
- Test across different browsers if making UI changes

## Commit Message Guidelines

- Use clear and descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused on a single change

## Pull Request Process

1. Update the README.md with details of your changes if appropriate
2. Ensure your code follows the project's architecture guidelines
3. Update any relevant documentation
4. Your PR will be reviewed by the maintainers

Thank you for contributing to DelhiveryOne! 