import React, { useState } from 'react';
import { Search, Download, Calendar, Filter, FileText } from 'lucide-react';
import { useBills, useCustomers, useWarehouses } from '../../hooks/useData';
import { Bill } from '../../types';
import Table, { Column } from '../Common/Table';
import StatusBadge from '../Common/StatusBadge';

interface FilterState {
  startDate: string;
  endDate: string;
  customerId: string;
  warehouseId: string;
  status: string;
}

export default function BillQuery() {
  const { bills, loading } = useBills();
  const { customers } = useCustomers();
  const { warehouses } = useWarehouses();
  
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    customerId: '',
    warehouseId: '',
    status: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const columns: Column<Bill>[] = [
    {
      key: 'billNumber',
      title: '账单号',
      sortable: true
    },
    {
      key: 'customerName',
      title: '货主',
      sortable: true
    },
    {
      key: 'warehouseName',
      title: '仓库',
      sortable: true
    },
    {
      key: 'periodStart',
      title: '账期开始',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'periodEnd',
      title: '账期结束',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'storageFees',
      title: '仓储费',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sortable: true
    },
    {
      key: 'operationFees',
      title: '操作费',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sortable: true
    },
    {
      key: 'extraFees',
      title: '额外费用',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sortable: true
    },
    {
      key: 'totalAmount',
      title: '总金额',
      render: (amount: number) => (
        <span className="font-bold text-gray-900">¥{amount.toLocaleString()}</span>
      ),
      sortable: true
    },
    {
      key: 'status',
      title: '状态',
      render: (status: string) => <StatusBadge status={status} type="bill" />
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sortable: true
    }
  ];

  // 筛选逻辑
  const filteredBills = bills.filter(bill => {
    if (filters.startDate && new Date(bill.periodStart) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(bill.periodEnd) > new Date(filters.endDate)) return false;
    if (filters.customerId && bill.customerId !== filters.customerId) return false;
    if (filters.warehouseId && bill.warehouseId !== filters.warehouseId) return false;
    if (filters.status && bill.status !== filters.status) return false;
    return true;
  });

  const handleExport = () => {
    // 模拟导出功能
    const csvContent = [
      ['账单号', '货主', '仓库', '账期开始', '账期结束', '仓储费', '操作费', '额外费用', '总金额', '状态'].join(','),
      ...filteredBills.map(bill => [
        bill.billNumber,
        bill.customerName,
        bill.warehouseName,
        bill.periodStart,
        bill.periodEnd,
        bill.storageFees,
        bill.operationFees,
        bill.extraFees,
        bill.totalAmount,
        bill.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `财务账单_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      customerId: '',
      warehouseId: '',
      status: ''
    });
  };

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const paidAmount = filteredBills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.totalAmount, 0);
  const unpaidAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">财务账单查询</h1>
          <p className="text-gray-600 mt-1">查询和管理财务账单信息</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
              showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>筛选</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始日期
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束日期
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                货主
              </label>
              <select
                value={filters.customerId}
                onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">全部货主</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                仓库
              </label>
              <select
                value={filters.warehouseId}
                onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">全部仓库</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">全部状态</option>
                <option value="draft">草稿</option>
                <option value="sent">已发送</option>
                <option value="paid">已支付</option>
                <option value="overdue">逾期</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      )}

      {/* 统计摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">账单总数</p>
              <p className="text-2xl font-bold text-gray-900">{filteredBills.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总金额</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalAmount.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已收款</p>
              <p className="text-2xl font-bold text-green-600">¥{paidAmount.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">未收款</p>
              <p className="text-2xl font-bold text-red-600">¥{unpaidAmount.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <Table columns={columns} data={filteredBills} loading={loading} />
    </div>
  );
}