import React from 'react';
import { 
  Users, 
  Warehouse, 
  Building2, 
  Receipt, 
  DollarSign, 
  FileText,
  Settings,
  BarChart3,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MenuItem } from '../../types';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    icon: 'BarChart3',
    path: 'dashboard'
  },
  {
    id: 'user-management',
    label: '用户管理',
    icon: 'Users',
    path: 'users',
    permission: 'user'
  },
  {
    id: 'basic-info',
    label: '基础信息',
    icon: 'Settings',
    path: '',
    children: [
      {
        id: 'warehouses',
        label: '仓库管理',
        icon: 'Warehouse',
        path: 'warehouses',
        permission: 'warehouse'
      },
      {
        id: 'customers',
        label: '货主管理',
        icon: 'Building2',
        path: 'customers',
        permission: 'customer'
      }
    ]
  },
  {
    id: 'orders',
    label: '订单数据',
    icon: 'Package',
    path: 'orders'
  },
  {
    id: 'fee-management',
    label: '费用管理',
    icon: 'DollarSign',
    path: '',
    children: [
      {
        id: 'fee-configs',
        label: '费用字段管理',
        icon: 'Settings',
        path: 'fee-configs',
        permission: 'fee'
      },
      {
        id: 'fees',
        label: '费用管理',
        icon: 'Receipt',
        path: 'fees',
        permission: 'fee'
      }
    ]
  },
  {
    id: 'bills',
    label: '财务账单查询',
    icon: 'FileText',
    path: 'bills',
    permission: 'bill'
  }
];

const iconMap = {
  Users,
  Warehouse,
  Building2,
  Receipt,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  Package
};

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { hasPermission } = useAuth();

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap];
    const isActive = currentPage === item.path;
    const hasChildren = item.children && item.children.length > 0;
    
    // Check permission
    if (item.permission && !hasPermission(item.permission, 'read')) {
      return null;
    }

    const handleClick = () => {
      if (item.path && !hasChildren) {
        onPageChange(item.path);
      }
    };

    return (
      <div key={item.id}>
        <button
          onClick={handleClick}
          className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } ${level > 0 ? 'pl-12' : ''}`}
        >
          <Icon className="h-5 w-5 mr-3" />
          <span className="font-medium">{item.label}</span>
        </button>
        
        {hasChildren && (
          <div className="ml-4">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">仓储财务系统</h1>
        <p className="text-gray-400 text-sm mt-1">Warehouse Finance Management</p>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          © 2024 仓储管理系统
        </div>
      </div>
    </div>
  );
}