'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../interfaces/User';
import UseFetching from '../hooks/UseFetching';
import AppDialog from '../components/AppDialog';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  openLogoutDialog: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      checkAuthStatus(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async (authToken: string) => {
    try {
      const response = await UseFetching<User>('http://localhost:8000/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setUser(response.data);
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await UseFetching<{ user: User; token: string }>('http://localhost:8000/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (response.error) {
        console.error('Login error:', response.error);
        alert(response.error || 'Login failed');
        return false;
      }

      if (!response.data) {
        alert('No response data received');
        return false;
      }

      const { user: userData, token: authToken } = response.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', errorMessage);
      alert(errorMessage);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await UseFetching<{ message: string }>('http://localhost:8000/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });

      if (response.error) {
        console.error('Register error:', response.error);
        alert(response.error || 'Registration failed');
        return false;
      }

      if (response.data) {
        console.log('Registration successful:', response.data.message);
      }

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('Register error:', errorMessage);
      alert(errorMessage);
      return false;
    }
  };

  const openLogoutDialog = () => setIsOpen(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    openLogoutDialog,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AppDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Confirm Logout</h2>
          <p className='text-gray-600 mb-6'>Are you sure you want to logout?</p>
          <div className='flex gap-3 justify-center'>
            <button 
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className='bg-blue-700 cursor-pointer text-gray-100 px-4 py-2 rounded-md hover:bg-blue-800 transition-colors'
            >
              Yes, Logout
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className='bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded-md hover:bg-gray-500 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      </AppDialog>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}