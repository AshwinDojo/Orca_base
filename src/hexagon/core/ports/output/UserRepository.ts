import { User } from '../../domain/User';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findAll(): Promise<User[]>;
} 