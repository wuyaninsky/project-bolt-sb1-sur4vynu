import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, DollarSign } from 'lucide-react';
import { useFeeConfigs } from '../../hooks/useData';
import { FeeConfig } from '../../types';
import Table, { Column } from '../Common/Table';
import Modal from '../Common/Modal';

interface FeeConfigFormData {
  name: string;
  type: 'storage' | 'operation' | 'transport' | 'other';
  unit: 'per_pallet' | 'per_item' | 'per_order' | 'fixed';
  basePrice: number;
  description: string;
  isActive: boolean;
}

export default function FeeConfigManagement() {
  const { feeConfigs, loading, addFeeConfig, updateFeeConfig, deleteFeeConfig } = useFeeConfigs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<FeeConfig | null>(null);
  const [formData, setFormData] = useState<FeeConfigFormData>({
    name: '',
    type: 'storage',
    unit: 'per_pallet',
    basePrice: 0,
    description: '',
    isActive: true
  });

  const typeMap = {
    storage: '仓储费用',
    operation: '操作费用',
    transport: '运输费用',
    other: '其他费用'
  };

  const unitMap = {
    per_pallet: '每板位',
    per_item: '每件',
    per_order: '每单',
    fixed: '固定费用'
  };

  const columns: Column<FeeConfig>[] = [
    {
      key: 'name',
      title: '费用名称',
      sortable: true
    },
    {
      key: 'type',
      title: '费用类型',
      render: (type: string) => typeMap[type as keyof typeof typeMap] || type
    },
    {
      key: 'unit',
      title: '计费单位',
      render: (unit: string) => unitMap[unit as keyof typeof unitMap] || unit
    },
    {
      key: 'basePrice',
      title: '基础价格',
      render: (price: number) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium">¥{price.toFixed(2)}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'description',
      title: '说明',
      render: (description: string) => (
        <span className="truncate max-w-xs" title={description}>
          {description}
        </span>
      )
    },
    {
      key: 'isActive',
      title: '状态',
      render: (isActive: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? '启用' : '禁用'}
        </span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      render: (_, config: FeeConfig) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(config)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(config.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    setEditingConfig(null);
    setFormData({
      name: '',
      type: 'storage',
      unit: 'per_pallet',
      basePrice: 0,
      description: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (config: FeeConfig) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      type: config.type,
      unit: config.unit,
      basePrice: config.basePrice,
      description: config.description,
      isActive: config.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个费用配置吗？')) {
      deleteFeeConfig(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingConfig) {
      updateFeeConfig(editingConfig.id, formData);
    } else {
      addFeeConfig(formData);
    }
    
    setIsModalOpen(false);
    setEditingConfig(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">费用字段管理</h1>
          <p className="text-gray-600 mt-1">配置各种费用类型和计费标准</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>添加费用配置</span>
        </button>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(typeMap).map(([key, label]) => {
          const count = feeConfigs.filter(config => config.type === key && config.isActive).length;
          return (
            <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>

      <Table columns={columns} data={feeConfigs} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConfig ? '编辑费用配置' : '添加费用配置'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              费用名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="例如：标准仓储费"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                费用类型
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="storage">仓储费用</option>
                <option value="operation">操作费用</option>
                <option value="transport">运输费用</option>
                <option value="other">其他费用</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                计费单位
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="per_pallet">每板位</option>
                <option value="per_item">每件</option>
                <option value="per_order">每单</option>
                <option value="fixed">固定费用</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              基础价格（元）
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              说明
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="费用说明和计费规则"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              启用此费用配置
            </label>
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
              {editingConfig ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}