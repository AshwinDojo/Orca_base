import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Permission } from '../../../core/domain/User';
import { AuthService } from '../../../core/ports/input/AuthService';

interface PermissionContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  hasPermission: (action: string, resource: string) => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  updateUserPermissions: (userId: string, permissions: Permission[]) => Promise<User>;
  createUser: (userData: Partial<User>) => Promise<User>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
  authService: AuthService;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ 
  children, 
  authService
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load authentication state from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Update authentication state from service
  useEffect(() => {
    const checkAuthentication = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    };

    checkAuthentication();
  }, [authService]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const { user } = await authService.login({ username, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('currentUser');
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Clear user from localStorage
    localStorage.removeItem('currentUser');
  };

  const hasPermission = async (action: string, resource: string): Promise<boolean> => {
    return authService.hasPermission(action, resource);
  };
  
  const getAllUsers = async (): Promise<User[]> => {
    return authService.getAllUsers();
  };
  
  const updateUserPermissions = async (userId: string, permissions: Permission[]): Promise<User> => {
    const updatedUser = await authService.updateUserPermissions(userId, permissions);
    
    // If the current user was updated, update the state
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }
    
    return updatedUser;
  };
  
  const createUser = async (userData: Partial<User>): Promise<User> => {
    return authService.createUser(userData);
  };

  const value = {
    isAuthenticated,
    currentUser,
    hasPermission,
    login,
    logout,
    getAllUsers,
    updateUserPermissions,
    createUser
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
}; 