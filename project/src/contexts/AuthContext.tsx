import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  canAccessWarehouse: (warehouseId: string) => boolean;
  canAccessCustomer: (customerId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@warehouse.com',
  role: 'admin',
  permissions: [
    { id: '1', name: '用户管理', module: 'user', actions: ['create', 'read', 'update', 'delete'] },
    { id: '2', name: '仓库管理', module: 'warehouse', actions: ['create', 'read', 'update', 'delete'] },
    { id: '3', name: '货主管理', module: 'customer', actions: ['create', 'read', 'update', 'delete'] },
    { id: '4', name: '费用管理', module: 'fee', actions: ['create', 'read', 'update', 'delete'] },
    { id: '5', name: '账单查询', module: 'bill', actions: ['read', 'export'] },
  ],
  warehouses: ['all'],
  customers: ['all'],
  createdAt: '2024-01-01',
  lastLogin: new Date().toISOString(),
  status: 'active'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock login logic
    if (username === 'admin' && password === 'admin123') {
      setUser(mockUser);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    const permission = user.permissions.find(p => p.module === module);
    return permission ? permission.actions.includes(action) : false;
  };

  const canAccessWarehouse = (warehouseId: string): boolean => {
    if (!user) return false;
    return user.warehouses.includes('all') || user.warehouses.includes(warehouseId);
  };

  const canAccessCustomer = (customerId: string): boolean => {
    if (!user) return false;
    return user.customers.includes('all') || user.customers.includes(customerId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      canAccessWarehouse,
      canAccessCustomer
    }}>
      {children}
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