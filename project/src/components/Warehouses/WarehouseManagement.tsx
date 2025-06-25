import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useWarehouses } from '../../hooks/useData';
import { Warehouse } from '../../types';
import Table, { Column } from '../Common/Table';
import Modal from '../Common/Modal';
import StatusBadge from '../Common/StatusBadge';

interface WarehouseFormData {
  name: string;
  code: string;
  address: string;
  manager: string;
  capacity: number;
  status: 'active' | 'inactive';
}

export default function WarehouseManagement() {
  const { warehouses, loading, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    code: '',
    address: '',
    manager: '',
    capacity: 0,
    status: 'active'
  });

  const columns: Column<Warehouse>[] = [
    {
      key: 'code',
      title: '仓库编码',
      sortable: true
    },
    {
      key: 'name',
      title: '仓库名称',
      sortable: true
    },
    {
      key: 'address',
      title: '地址',
      render: (address: string) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate max-w-xs" title={address}>{address}</span>
        </div>
      )
    },
    {
      key: 'manager',
      title: '负责人',
      sortable: true
    },
    {
      key: 'capacity',
      title: '容量使用',
      render: (_, warehouse: Warehouse) => {
        const utilization = (warehouse.usedCapacity / warehouse.capacity) * 100;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {warehouse.usedCapacity} / {warehouse.capacity}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  utilization > 80 ? 'bg-red-500' :
                  utilization > 60 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${utilization}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      title: '状态',
      render: (status: string) => <StatusBadge status={status} type="warehouse" />
    },
    {
      key: 'actions',
      title: '操作',
      render: (_, warehouse: Warehouse) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(warehouse)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(warehouse.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    setEditingWarehouse(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      manager: '',
      capacity: 0,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      manager: warehouse.manager,
      capacity: warehouse.capacity,
      status: warehouse.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个仓库吗？')) {
      deleteWarehouse(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, formData);
    } else {
      addWarehouse({
        ...formData,
        usedCapacity: 0
      });
    }
    
    setIsModalOpen(false);
    setEditingWarehouse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">仓库管理</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>添加仓库</span>
        </button>
      </div>

      <Table columns={columns} data={warehouses} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWarehouse ? '编辑仓库' : '添加仓库'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              仓库编码
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="例如：SH001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              仓库名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="例如：上海仓库"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              地址
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="详细地址"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              负责人
            </label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="负责人姓名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              总容量（板位）
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              required
            />
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
              <option value="inactive">停用</option>
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
              {editingWarehouse ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}