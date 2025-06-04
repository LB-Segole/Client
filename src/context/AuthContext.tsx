import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth service for demo purposes
// In a real app, this would connect to your backend or auth provider
const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any credentials
    const user: User = {
      id: '1',
      name: 'Demo User',
      email: credentials.email,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('auth_token', 'demo_token');
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },
  
  register: async (data: RegisterData): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      name: data.name,
      email: data.email,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('auth_token', 'demo_token');
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },
  
  logout: async (): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (mockAuthService.isAuthenticated()) {
        try {
          const userData = mockAuthService.getUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          await mockAuthService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userData = await mockAuthService.login(credentials);
      setUser(userData);
      toast.success('Login successful', {
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      toast.error('Login failed', {
        description: "Invalid email or password",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const userData = await mockAuthService.register(data);
      setUser(userData);
      toast.success('Registration successful', {
        description: `Welcome, ${userData.name}!`,
      });
    } catch (error) {
      toast.error('Registration failed', {
        description: "Could not create account",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await mockAuthService.logout();
      setUser(null);
      toast.success('Logged out', {
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};