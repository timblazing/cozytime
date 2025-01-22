import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (emailOrName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    // Update auth state when PocketBase auth store changes
    return pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
    });
  }, []);

  const login = async (emailOrName: string, password: string) => {
    try {
      // First try to find user by name
      const records = await pb.collection('users').getList(1, 1, {
        filter: `name = "${emailOrName}"`,
      });
      
      // If found by name, use their email to authenticate
      if (records.items.length > 0) {
        await pb.collection('users').authWithPassword(records.items[0].email, password);
        return;
      }

      // If not found by name, try direct email authentication
      await pb.collection('users').authWithPassword(emailOrName, password);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email/username or password');
    }
  };

  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
