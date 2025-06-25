export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  permissions: Permission[];
  warehouses: string[];
  customers: string[];
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  actions: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  capacity: number;
  usedCapacity: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  warehouseId: string;
  warehouseName: string;
  orderType: 'inbound' | 'outbound';
  quantity: number;
  palletCount: number;
  createdAt: string;
  completedAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface FeeConfig {
  id: string;
  name: string;
  type: 'storage' | 'operation' | 'transport' | 'other';
  unit: 'per_pallet' | 'per_item' | 'per_order' | 'fixed';
  basePrice: number;
  description: string;
  isActive: boolean;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  warehouseId: string;
  warehouseName: string;
  periodStart: string;
  periodEnd: string;
  storageFees: number;
  operationFees: number;
  extraFees: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  paidAt?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
  permission?: string;
}