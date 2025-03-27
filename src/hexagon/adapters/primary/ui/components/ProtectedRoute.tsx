import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermission } from '../../providers/PermissionProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAction?: string;
  requiredResource?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredAction, 
  requiredResource 
}) => {
  const { isAuthenticated, hasPermission } = usePermission();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [shouldRedirectToSettings, setShouldRedirectToSettings] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkPermission = async () => {
      // If we don't need to check permissions, just check authentication
      if (!requiredAction || !requiredResource) {
        setHasAccess(isAuthenticated);
        
        // Check if user is a new user (has no active services)
        const activeServices = localStorage.getItem('activeServices');
        const isSettingsPage = location.pathname === '/settings';
        
        // Only redirect to settings if not already on the settings page
        if (isAuthenticated && (!activeServices || activeServices === '[]') && !isSettingsPage) {
          setShouldRedirectToSettings(true);
        }
        
        return;
      }

      // Otherwise check if the user has the required permission
      const permitted = await hasPermission(requiredAction, requiredResource);
      setHasAccess(permitted);
    };

    checkPermission();
  }, [isAuthenticated, hasPermission, requiredAction, requiredResource, location.pathname]);

  // Still loading
  if (hasAccess === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // New user, redirect to settings
  if (shouldRedirectToSettings) {
    return <Navigate to="/settings" state={{ from: location }} replace />;
  }

  // Authenticated but doesn't have permission
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and has permission
  return <>{children}</>;
}; 