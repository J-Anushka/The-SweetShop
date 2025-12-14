export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string; // Only used internally in mock DB
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image?: string;
}

export interface CartItem extends Sweet {
  cartQuantity: number;
}

// For form inputs
export type SweetInput = Omit<Sweet, 'id'>;