import { User, Permission } from '../../domain/User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  hasPermission(permission: string, resource: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  updateUserPermissions(userId: string, permissions: Permission[]): Promise<User>;
  createUser(userData: Partial<User>): Promise<User>;
} 