import { User, Permission } from '../domain/User';
import { AuthService, LoginCredentials } from '../ports/input/AuthService';
import { UserRepository } from '../ports/output/UserRepository';

export class AuthServiceImpl implements AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor(private readonly userRepository: UserRepository) {
    // Try to load user from localStorage on initialization
    this.restoreSession();
  }

  private restoreSession() {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.token = storedToken;
      } catch (error) {
        console.error('Failed to restore session:', error);
        this.clearSession();
      }
    }
  }

  private clearSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUser = null;
    this.token = null;
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // In a real app, this would validate credentials against a backend
    const user = await this.userRepository.findByUsername(credentials.username);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In a real app, this would be a JWT token from the backend
    this.token = `dummy-token-${Date.now()}`;
    this.currentUser = user;

    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', this.token);

    return { user, token: this.token };
  }

  async logout(): Promise<void> {
    this.clearSession();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async hasPermission(action: string, resource: string): Promise<boolean> {
    if (!this.currentUser) {
      return false;
    }

    // Check if the user has the permission
    return this.currentUser.roles.some(role => 
      role.permissions.some(
        permission => 
          permission.action === action && 
          permission.resource === resource
      )
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    // Check if current user has permission to read users
    const canReadUsers = await this.hasPermission('read', 'user');
    if (!canReadUsers) {
      throw new Error('Not authorized to view users');
    }
    
    return this.userRepository.findAll();
  }
  
  async updateUserPermissions(userId: string, permissions: Permission[]): Promise<User> {
    // Check if current user has permission to update users
    const canManageUsers = await this.hasPermission('update', 'user');
    if (!canManageUsers) {
      throw new Error('Not authorized to manage user permissions');
    }
    
    // Get the user to update
    const userToUpdate = await this.userRepository.findById(userId);
    if (!userToUpdate) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    // Update the user's permissions
    // In a real app, we'd have a more sophisticated mechanism to handle multiple roles
    // For simplicity, we're just updating the permissions of the first role
    if (userToUpdate.roles.length > 0) {
      userToUpdate.roles[0].permissions = permissions;
    }
    
    // Save the updated user
    const updatedUser = await this.userRepository.update(userToUpdate);
    
    // If updating the current user, update the local state
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  }
  
  async createUser(userData: Partial<User>): Promise<User> {
    // Check if current user has permission to manage users
    const canManageUsers = await this.hasPermission('update', 'user');
    if (!canManageUsers) {
      throw new Error('Not authorized to create users');
    }
    
    // Check if username already exists
    if (userData.username) {
      const existingUser = await this.userRepository.findByUsername(userData.username);
      if (existingUser) {
        throw new Error(`Username ${userData.username} already exists`);
      }
    } else {
      throw new Error('Username is required');
    }
    
    // Create a new user with basic permissions
    const newUser: User = {
      id: '', // Will be assigned by the repository
      username: userData.username,
      email: userData.email || `${userData.username}@example.com`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roles: [
        {
          id: Math.random().toString(36).substring(2, 11), // Generate a random ID
          name: 'USER',
          permissions: [
            { 
              id: Math.random().toString(36).substring(2, 11),
              name: 'View Any Shipment',
              resource: 'shipment',
              action: 'read'
            }
          ]
        }
      ]
    };
    
    // Save the new user
    return this.userRepository.save(newUser);
  }
} 