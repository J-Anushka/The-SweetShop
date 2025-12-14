import { Sweet, User, UserRole } from '../types';

/**
 * SIMULATED DATABASE
 * In a real backend, this would be your ORM (Prisma/TypeORM) logic.
 * We use LocalStorage here to persist data in the browser for the demo.
 */

const KEYS = {
  USERS: 'sr_users',
  SWEETS: 'sr_sweets',
  INIT: 'sr_init_v2' // Incremented version to force re-seed with new images
};

// Seed Data
const INITIAL_SWEETS: Sweet[] = [
  { 
    id: '1', 
    name: 'Rainbow Lollipops', 
    category: 'Hard Candy', 
    price: 2.50, 
    quantity: 50, 
    description: 'Swirly, colorful, and long-lasting fruit flavor.', 
    image: 'https://images.unsplash.com/photo-1575224300306-1b8da9b66eeb?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: '2', 
    name: 'Dark Truffles', 
    category: 'Chocolate', 
    price: 12.00, 
    quantity: 20, 
    description: '80% cocoa dark chocolate ganache truffles.', 
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: '3', 
    name: 'Sour Gummy Worms', 
    category: 'Gummies', 
    price: 3.99, 
    quantity: 0, 
    description: 'Super sour neon worms. Warning: Addictive.', 
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: '4', 
    name: 'Peppermint Bark', 
    category: 'Seasonal', 
    price: 8.50, 
    quantity: 15, 
    description: 'White and dark chocolate layered with crushed candy cane.', 
    image: 'https://images.unsplash.com/photo-1632685714777-2c96c56db36d?auto=format&fit=crop&w=500&q=80' 
  },
];

const INITIAL_USERS: User[] = [
  { id: 'admin1', username: 'admin', role: UserRole.ADMIN, password: 'password123' },
  { id: 'user1', username: 'user', role: UserRole.USER, password: 'password123' },
];

// Initialize DB
const initDB = () => {
  if (!localStorage.getItem(KEYS.INIT)) {
    localStorage.setItem(KEYS.SWEETS, JSON.stringify(INITIAL_SWEETS));
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.INIT, 'true');
  }
};

initDB();

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  sweets: {
    getAll: async (): Promise<Sweet[]> => {
      await delay(300);
      return JSON.parse(localStorage.getItem(KEYS.SWEETS) || '[]');
    },
    getById: async (id: string): Promise<Sweet | undefined> => {
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(KEYS.SWEETS) || '[]');
      return sweets.find(s => s.id === id);
    },
    create: async (sweet: Sweet): Promise<Sweet> => {
      await delay(300);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(KEYS.SWEETS) || '[]');
      sweets.push(sweet);
      localStorage.setItem(KEYS.SWEETS, JSON.stringify(sweets));
      return sweet;
    },
    update: async (id: string, updates: Partial<Sweet>): Promise<Sweet> => {
      await delay(300);
      const sweets: Sweet[] = JSON.parse(localStorage.getItem(KEYS.SWEETS) || '[]');
      const index = sweets.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Sweet not found');
      
      const updatedSweet = { ...sweets[index], ...updates };
      sweets[index] = updatedSweet;
      localStorage.setItem(KEYS.SWEETS, JSON.stringify(sweets));
      return updatedSweet;
    },
    delete: async (id: string): Promise<void> => {
      await delay(300);
      let sweets: Sweet[] = JSON.parse(localStorage.getItem(KEYS.SWEETS) || '[]');
      sweets = sweets.filter(s => s.id !== id);
      localStorage.setItem(KEYS.SWEETS, JSON.stringify(sweets));
    }
  },
  users: {
    findByUsername: async (username: string): Promise<User | undefined> => {
      await delay(300);
      const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      return users.find(u => u.username === username);
    },
    create: async (user: User): Promise<User> => {
      await delay(300);
      const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      if (users.find(u => u.username === user.username)) {
        throw new Error('Username already exists');
      }
      users.push(user);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      return user;
    }
  }
};