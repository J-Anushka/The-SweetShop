import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../services/authContext';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.auth.login(username, password);
      login(data);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-sweet-card p-8 rounded-2xl shadow-lg border border-sweet-text/10">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 mb-4">
            <Logo className="w-full h-full" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-sweet-text">Welcome back</h2>
          <p className="mt-2 text-sm text-sweet-text/70">
            Or <Link to="/register" className="font-medium text-sweet-primary hover:text-sweet-primary/80">start your sugar rush today</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-sweet-text/20 placeholder-sweet-text/40 text-sweet-text rounded-t-md focus:outline-none focus:ring-sweet-primary focus:border-sweet-primary focus:z-10 sm:text-sm bg-white/80"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-sweet-text/20 placeholder-sweet-text/40 text-sweet-text rounded-b-md focus:outline-none focus:ring-sweet-primary focus:border-sweet-primary focus:z-10 sm:text-sm bg-white/80"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sweet-primary hover:bg-sweet-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sweet-primary transition-colors shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          </div>
          
          <div className="text-center text-xs text-sweet-text/50">
             Demo Credentials: <br/>
             Admin: admin / password123 <br/>
             User: user / password123
          </div>
        </form>
      </div>
    </div>
  );
};