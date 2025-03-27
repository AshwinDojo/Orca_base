import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import infrastructure providers
import { PermissionProvider } from './hexagon/adapters/primary/providers/PermissionProvider';
import { ServiceTypeProvider } from './hexagon/adapters/primary/providers/ServiceTypeProvider';

// Import UI components and pages
import { ProtectedRoute } from './hexagon/adapters/primary/ui/components/ProtectedRoute';
import { LoginPage } from './hexagon/adapters/primary/ui/pages/LoginPage';
import { UnauthorizedPage } from './hexagon/adapters/primary/ui/pages/UnauthorizedPage';
import { ServiceSelectorPage } from './hexagon/adapters/primary/ui/pages/ServiceSelectorPage';
import { B2BDashboard } from './hexagon/adapters/primary/ui/pages/B2BDashboard';
import { B2CDashboard } from './hexagon/adapters/primary/ui/pages/B2CDashboard';
import { InternationalDashboard } from './hexagon/adapters/primary/ui/pages/InternationalDashboard';
import { SettingsPage } from './hexagon/adapters/primary/ui/pages/SettingsPage';

// Import feature pages
import { B2BShipmentListingPage } from './hexagon/adapters/primary/features/b2b/ShipmentListingPage';
import { B2CShipmentListingPage } from './hexagon/adapters/primary/features/b2c/ShipmentListingPage';
import { InternationalShipmentListingPage } from './hexagon/adapters/primary/features/international/ShipmentListingPage';

// Import secondary adapters
import { UserLocalStorageRepository } from './hexagon/adapters/secondary/UserLocalStorageRepository';
import { ShipmentApiRepository } from './hexagon/adapters/secondary/ShipmentApiRepository';

// Import services
import { AuthServiceImpl } from './hexagon/core/services/AuthServiceImpl';
import { ShipmentServiceImpl } from './hexagon/core/services/ShipmentServiceImpl';

// Create repositories
const userRepository = new UserLocalStorageRepository();
const shipmentApiRepository = new ShipmentApiRepository();

// Create services
const authService = new AuthServiceImpl(userRepository);
const shipmentService = new ShipmentServiceImpl(shipmentApiRepository);

function App() {
  return (
    <Router>
      <PermissionProvider authService={authService}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Settings Page - Common for all users */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Service Selector Route */}
          <Route 
            path="/service-selector" 
            element={
              <ProtectedRoute>
                <ServiceSelectorPage />
              </ProtectedRoute>
            } 
          />
          
          {/* B2B Routes */}
          <Route 
            path="/b2b" 
            element={
              <ProtectedRoute>
                <ServiceTypeProvider serviceType="B2B" shipmentService={shipmentService}>
                  <B2BDashboard />
                </ServiceTypeProvider>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/b2b/shipments" 
            element={
              <ProtectedRoute>
                <ServiceTypeProvider serviceType="B2B" shipmentService={shipmentService}>
                  <B2BShipmentListingPage />
                </ServiceTypeProvider>
              </ProtectedRoute>
            } 
          />
          
          {/* B2C Routes */}
          <Route 
            path="/b2c" 
            element={
              <ProtectedRoute>
              <ServiceTypeProvider serviceType="B2C" shipmentService={shipmentService}>
                  <B2CDashboard />
                </ServiceTypeProvider>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/b2c/shipments" 
            element={
              <ProtectedRoute>
                <ServiceTypeProvider serviceType="B2C" shipmentService={shipmentService}>
                  <B2CShipmentListingPage />
                </ServiceTypeProvider>
              </ProtectedRoute>
            } 
          />
          
          {/* International Routes */}
          <Route 
            path="/international" 
            element={
              <ProtectedRoute>
                <ServiceTypeProvider serviceType="INTERNATIONAL" shipmentService={shipmentService}>
                  <InternationalDashboard />
                </ServiceTypeProvider>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/international/shipments" 
            element={
              <ProtectedRoute>
                <ServiceTypeProvider serviceType="INTERNATIONAL" shipmentService={shipmentService}>
                  <InternationalShipmentListingPage />
                </ServiceTypeProvider>
              </ProtectedRoute>
            } 
          />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to="/settings" replace />} />
        </Routes>
      </PermissionProvider>
    </Router>
  );
}

export default App;
