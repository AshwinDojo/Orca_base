# DelhiveryOne Frontend

A modern logistics management system built with React, TypeScript, and Hexagonal Architecture.

## Overview

DelhiveryOne is a comprehensive logistics platform that supports multiple service types:
- B2B Shipping
- B2C Shipping
- International Shipping

The application demonstrates how to build a maintainable and extensible system using hexagonal architecture principles, allowing for clean separation of concerns and easy addition of new service types.

## Architecture

This project is built using a hexagonal architecture (ports and adapters) pattern:

- **Domain Layer**: Core business logic and models
- **Application Layer**: Use cases and services
- **UI Layer**: React components and pages
- **Adapters**: Primary adapters (UI-facing) and Secondary adapters (external services)

For detailed architecture information, see the [Architecture Documentation](./docs/DelhiveryOne-Architecture.md).

## Key Features

- Service type selection and switching
- Dashboard views per service type
- Shipment listings per service type
- Permissions-based user access
- Dynamic API endpoints based on service type

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Access the application at http://localhost:3000

## Login Information

Use the following credentials to test the application:

- Username: `admin` (Administrator with all permissions)
- Username: `owner` (Business owner with create/view permissions)
- Username: `customer` (Customer with view-only permissions)

Any password will work for the demo.

## Project Structure

```
src/
├── features/               # Feature-specific components
├── hexagon/                # Hexagonal architecture implementation
│   ├── adapters/           # Primary and secondary adapters
│   │   ├── primary/        # UI-facing adapters
│   │   └── secondary/      # External systems adapters
│   ├── core/               # Domain core
│   │   ├── domain/         # Business entities
│   │   ├── ports/          # Interface definitions
│   │   │   ├── input/      # Use case interfaces
│   │   │   └── output/     # Repository interfaces
│   │   └── services/       # Business logic implementations
│   └── infrastructure/     # Application infrastructure
│       └── providers/      # Context providers
├── mock-data/              # Mock data for demonstration
├── ui/                     # UI components
│   ├── components/         # Reusable UI components
│   └── pages/              # Page components
└── index.tsx               # Application entry point
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
