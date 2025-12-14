import { db } from './db';
import { Sweet, SweetInput, AuthResponse, UserRole } from '../types';

// Helper to simulate a JWT token
const generateToken = () => Math.random().toString(36).substr(2) + Date.now().toString(36);

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      const user = await db.users.findByUsername(username);
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token: generateToken()
      };
    },
    
    register: async (username: string, password: string): Promise<AuthResponse> => {
      // Logic to assign admin role based on username for demo purposes
      const role = username.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
      
      const user = await db.users.create({
        id: Math.random().toString(36).substr(2, 9),
        username,
        password,
        role
      });
      
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token: generateToken()
      };
    }
  },
  
  sweets: {
    getAll: () => db.sweets.getAll(),
    
    getById: (id: string) => db.sweets.getById(id),
    
    create: (data: SweetInput) => {
      return db.sweets.create({
        ...data,
        id: Math.random().toString(36).substr(2, 9)
      });
    },
    
    update: (id: string, data: Partial<Sweet>) => db.sweets.update(id, data),
    
    delete: (id: string) => db.sweets.delete(id),
    
    purchase: async (id: string, quantity: number) => {
      const sweet = await db.sweets.getById(id);
      if (!sweet) throw new Error('Sweet not found');
      if (sweet.quantity < quantity) throw new Error('Insufficient stock');
      
      return db.sweets.update(id, { quantity: sweet.quantity - quantity });
    },
    
    restock: async (id: string, quantity: number) => {
      const sweet = await db.sweets.getById(id);
      if (!sweet) throw new Error('Sweet not found');
      
      return db.sweets.update(id, { quantity: sweet.quantity + quantity });
    }
  }
};