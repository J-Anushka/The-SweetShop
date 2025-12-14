import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { UserRole } from '../types';
import { LogOut, ShieldCheck, ShoppingBag, User as UserIcon } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-sweet-primary bg-sweet-primary/10' : 'text-sweet-text/80 hover:text-sweet-primary';

  return (
    <nav className="sticky top-0 z-50 bg-sweet-card shadow-sm border-b border-sweet-text/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <Logo className="h-12 w-12 transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-xl text-sweet-text">The <span className="text-sweet-primary">SweetShop</span></span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}
                >
                  <div className="flex items-center gap-1">
                    <ShoppingBag size={18} />
                    Shop
                  </div>
                </Link>
                
                {user?.role === UserRole.ADMIN && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')}`}
                  >
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={18} />
                      Admin
                    </div>
                  </Link>
                )}
                
                <div className="flex items-center gap-3 pl-4 border-l border-sweet-text/20">
                  <div className="flex items-center gap-2 text-sm text-sweet-text/80">
                    <UserIcon size={16} />
                    <span className="font-medium hidden sm:block">{user?.username}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-sweet-text/50 hover:text-sweet-primary transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-sweet-primary hover:bg-sweet-primary/10 rounded-md transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-sweet-primary hover:bg-sweet-primary/90 rounded-md shadow-sm transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};