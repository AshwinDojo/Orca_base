import { User } from '../../core/domain/User';
import { UserRepository } from '../../core/ports/output/UserRepository';

export class UserLocalStorageRepository implements UserRepository {
  private readonly storageKey = 'logistics_users';

  constructor() {
    // Force reset users for the demo
    this.resetUsers();
  }

  // Reset users for demo purposes
  private resetUsers(): void {
    localStorage.removeItem(this.storageKey);
    this.initializeUsers();
    console.log('User data has been reset with new usernames');
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  private initializeUsers(): void {
    const users: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        roles: [
          {
            id: '1',
            name: 'ADMIN',
            permissions: [
              { id: '1', name: 'Create B2B Shipment', resource: 'shipment', action: 'create' },
              { id: '2', name: 'View B2B Shipment', resource: 'shipment', action: 'read' },
              { id: '3', name: 'Update B2B Shipment', resource: 'shipment', action: 'update' },
              { id: '4', name: 'Delete B2B Shipment', resource: 'shipment', action: 'delete' },
              { id: '20', name: 'Manage B2B Service', resource: 'service:b2b', action: 'update' },
              { id: '21', name: 'Manage B2C Service', resource: 'service:b2c', action: 'update' },
              { id: '22', name: 'Manage International Service', resource: 'service:international', action: 'update' },
              { id: '23', name: 'Manage Users', resource: 'user', action: 'update' },
              { id: '24', name: 'Read Users', resource: 'user', action: 'read' }
            ]
          }
        ]
      },
      {
        id: '2',
        username: 'owner',
        email: 'owner@example.com',
        roles: [
          {
            id: '2',
            name: 'OWNER',
            permissions: [
              { id: '5', name: 'Create B2C Shipment', resource: 'shipment', action: 'create' },
              { id: '6', name: 'View B2C Shipment', resource: 'shipment', action: 'read' },
              { id: '7', name: 'Update B2C Shipment', resource: 'shipment', action: 'update' },
              { id: '8', name: 'Delete B2C Shipment', resource: 'shipment', action: 'delete' },
              { id: '9', name: 'Create International Shipment', resource: 'shipment', action: 'create' },
              { id: '10', name: 'View International Shipment', resource: 'shipment', action: 'read' },
              { id: '11', name: 'Manage B2C Service', resource: 'service:b2c', action: 'update' },
              { id: '20', name: 'Manage B2B Service', resource: 'service:b2b', action: 'update' },
              { id: '12', name: 'Manage International Service', resource: 'service:international', action: 'update' },
              { id: '13', name: 'Manage Users', resource: 'user', action: 'update' },
              { id: '15', name: 'Read Users', resource: 'user', action: 'read' }
            ]
          }
        ]
      },
      {
        id: '3',
        username: 'customer',
        email: 'customer@example.com',
        roles: [
          {
            id: '3',
            name: 'CUSTOMER',
            permissions: [
              { id: '14', name: 'View Any Shipment', resource: 'shipment', action: 'read' }
            ]
          }
        ]
      },
      {
        id: '4',
        username: 'newuser',
        email: 'newuser@example.com',
        roles: [
          {
            id: '4',
            name: 'USER',
            permissions: [
              { id: '16', name: 'View Any Shipment', resource: 'shipment', action: 'read' }
            ]
          }
        ]
      }
    ];

    this.saveUsers(users);
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    return user || null;
  }

  async save(user: User): Promise<User> {
    const users = this.getUsers();
    
    // Generate a new ID if not provided
    if (!user.id) {
      const maxId = Math.max(...users.map(u => parseInt(u.id)), 0);
      user.id = (maxId + 1).toString();
    }
    
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  async update(user: User): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index === -1) {
      throw new Error(`User with id ${user.id} not found`);
    }
    
    users[index] = user;
    this.saveUsers(users);
    return user;
  }
  
  async findAll(): Promise<User[]> {
    return this.getUsers();
  }
} 