import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useUsers } from '../../hooks/useData';
import { User } from '../../types';
import Table, { Column } from '../Common/Table';
import Modal from '../Common/Modal';
import StatusBadge from '../Common/StatusBadge';

interface UserFormData {
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  warehouses: string[];
  customers: string[];
  status: 'active' | 'inactive';
}

export default function UserManagement() {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'operator',
    warehouses: [],
    customers: [],
    status: 'active'
  });

  const columns: Column<User>[] = [
    {
      key: 'username',
      title: '用户名',
      sortable: true
    },
    {
      key: 'email',
      title: '邮箱',
      sortable: true
    },
    {
      key: 'role',
      title: '角色',
      render: (role: string) => {
        const roleMap = {
          admin: '系统管理员',
          manager: '管理员',
          operator: '操作员'
        };
        return roleMap[role as keyof typeof roleMap] || role;
      }
    },
    {
      key: 'status',
      title: '状态',
      render: (status: string) => <StatusBadge status={status} type="user" />
    },
    {
      key: 'lastLogin',
      title: '最后登录',
      render: (lastLogin: string) => lastLogin ? new Date(lastLogin).toLocaleString() : '从未登录'
    },
    {
      key: 'actions',
      title: '操作',
      render: (_, user: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'operator',
      warehouses: [],
      customers: [],
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      warehouses: user.warehouses,
      customers: user.customers,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      deleteUser(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser({
        ...formData,
        permissions: []
      });
    }
    
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>添加用户</span>
        </button>
      </div>

      <Table columns={columns} data={users} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? '编辑用户' : '添加用户'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="operator">操作员</option>
              <option value="manager">管理员</option>
              <option value="admin">系统管理员</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">正常</option>
              <option value="inactive">禁用</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingUser ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}