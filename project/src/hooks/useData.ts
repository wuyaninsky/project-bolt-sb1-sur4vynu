import { useState, useEffect } from 'react';
import { User, Warehouse, Customer, Order, FeeConfig, Bill } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@warehouse.com',
    role: 'admin',
    permissions: [],
    warehouses: ['all'],
    customers: ['all'],
    createdAt: '2024-01-01',
    lastLogin: '2024-12-19T10:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager1@warehouse.com',
    role: 'manager',
    permissions: [],
    warehouses: ['1', '2'],
    customers: ['1', '2', '3'],
    createdAt: '2024-01-15',
    lastLogin: '2024-12-18T15:20:00Z',
    status: 'active'
  }
];

const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: '上海仓库',
    code: 'SH001',
    address: '上海市浦东新区XX路123号',
    manager: '张经理',
    capacity: 1000,
    usedCapacity: 750,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: '北京仓库',
    code: 'BJ001',
    address: '北京市朝阳区XX路456号',
    manager: '李经理',
    capacity: 800,
    usedCapacity: 600,
    status: 'active',
    createdAt: '2024-01-15'
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '阿里巴巴集团',
    code: 'ALI001',
    contactPerson: '王先生',
    phone: '13800138001',
    email: 'wang@alibaba.com',
    address: '杭州市西湖区XX路789号',
    paymentTerms: 30,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: '腾讯科技',
    code: 'TX001',
    contactPerson: '刘女士',
    phone: '13800138002',
    email: 'liu@tencent.com',
    address: '深圳市南山区XX路101号',
    paymentTerms: 15,
    status: 'active',
    createdAt: '2024-01-10'
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD202412190001',
    customerId: '1',
    customerName: '阿里巴巴集团',
    warehouseId: '1',
    warehouseName: '上海仓库',
    orderType: 'inbound',
    quantity: 500,
    palletCount: 25,
    createdAt: '2024-12-19T08:00:00Z',
    completedAt: '2024-12-19T12:00:00Z',
    status: 'completed'
  },
  {
    id: '2',
    orderNumber: 'ORD202412190002',
    customerId: '2',
    customerName: '腾讯科技',
    warehouseId: '2',
    warehouseName: '北京仓库',
    orderType: 'outbound',
    quantity: 300,
    palletCount: 15,
    createdAt: '2024-12-19T09:30:00Z',
    status: 'processing'
  }
];

const mockFeeConfigs: FeeConfig[] = [
  {
    id: '1',
    name: '标准仓储费',
    type: 'storage',
    unit: 'per_pallet',
    basePrice: 50,
    description: '每个板位每天的仓储费用',
    isActive: true
  },
  {
    id: '2',
    name: '入库操作费',
    type: 'operation',
    unit: 'per_order',
    basePrice: 100,
    description: '入库操作费用',
    isActive: true
  },
  {
    id: '3',
    name: '快递费',
    type: 'transport',
    unit: 'per_item',
    basePrice: 15,
    description: '快递配送费用',
    isActive: true
  }
];

const mockBills: Bill[] = [
  {
    id: '1',
    billNumber: 'BILL202412001',
    customerId: '1',
    customerName: '阿里巴巴集团',
    warehouseId: '1',
    warehouseName: '上海仓库',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    storageFees: 15000,
    operationFees: 3000,
    extraFees: 1200,
    totalAmount: 19200,
    status: 'sent',
    createdAt: '2024-12-19T00:00:00Z'
  },
  {
    id: '2',
    billNumber: 'BILL202412002',
    customerId: '2',
    customerName: '腾讯科技',
    warehouseId: '2',
    warehouseName: '北京仓库',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    storageFees: 12000,
    operationFees: 2500,
    extraFees: 800,
    totalAmount: 15300,
    status: 'paid',
    createdAt: '2024-12-18T00:00:00Z',
    paidAt: '2024-12-19T14:30:00Z'
  }
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return { users, loading, addUser, updateUser, deleteUser };
}

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWarehouses(mockWarehouses);
      setLoading(false);
    }, 500);
  }, []);

  const addWarehouse = (warehouse: Omit<Warehouse, 'id' | 'createdAt'>) => {
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWarehouses(prev => [...prev, newWarehouse]);
    return newWarehouse;
  };

  const updateWarehouse = (id: string, updates: Partial<Warehouse>) => {
    setWarehouses(prev => prev.map(warehouse => 
      warehouse.id === id ? { ...warehouse, ...updates } : warehouse
    ));
  };

  const deleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(warehouse => warehouse.id !== id));
  };

  return { warehouses, loading, addWarehouse, updateWarehouse, deleteWarehouse };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  }, []);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  return { customers, loading, addCustomer, updateCustomer, deleteCustomer };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  return { orders, loading };
}

export function useFeeConfigs() {
  const [feeConfigs, setFeeConfigs] = useState<FeeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFeeConfigs(mockFeeConfigs);
      setLoading(false);
    }, 500);
  }, []);

  const addFeeConfig = (config: Omit<FeeConfig, 'id'>) => {
    const newConfig: FeeConfig = {
      ...config,
      id: Date.now().toString()
    };
    setFeeConfigs(prev => [...prev, newConfig]);
    return newConfig;
  };

  const updateFeeConfig = (id: string, updates: Partial<FeeConfig>) => {
    setFeeConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, ...updates } : config
    ));
  };

  const deleteFeeConfig = (id: string) => {
    setFeeConfigs(prev => prev.filter(config => config.id !== id));
  };

  return { feeConfigs, loading, addFeeConfig, updateFeeConfig, deleteFeeConfig };
}

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBills(mockBills);
      setLoading(false);
    }, 500);
  }, []);

  return { bills, loading };
}