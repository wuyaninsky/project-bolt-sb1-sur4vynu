import React from 'react';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useOrders } from '../../hooks/useData';
import { Order } from '../../types';
import Table, { Column } from '../Common/Table';
import StatusBadge from '../Common/StatusBadge';

export default function OrderList() {
  const { orders, loading } = useOrders();

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      title: '订单号',
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
      key: 'orderType',
      title: '类型',
      render: (type: string) => (
        <div className="flex items-center space-x-1">
          {type === 'inbound' ? (
            <>
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-green-600">入库</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">出库</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'quantity',
      title: '数量',
      render: (quantity: number) => quantity.toLocaleString(),
      sortable: true
    },
    {
      key: 'palletCount',
      title: '板位数',
      render: (palletCount: number) => `${palletCount}个`,
      sortable: true
    },
    {
      key: 'status',
      title: '状态',
      render: (status: string) => <StatusBadge status={status} type="order" />
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
      sortable: true
    },
    {
      key: 'completedAt',
      title: '完成时间',
      render: (completedAt: string) => completedAt ? new Date(completedAt).toLocaleString() : '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">订单数据</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>来源：MySQL数据库</span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总订单数</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">入库订单</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderType === 'inbound').length}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">出库订单</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.orderType === 'outbound').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <Table columns={columns} data={orders} loading={loading} />
    </div>
  );
}