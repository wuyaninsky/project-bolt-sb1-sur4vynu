import React from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Users, Warehouse } from 'lucide-react';
import { useBills, useOrders, useCustomers, useWarehouses } from '../../hooks/useData';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${
                changeType === 'negative' ? 'rotate-180' : ''
              }`} />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { bills } = useBills();
  const { orders } = useOrders();
  const { customers } = useCustomers();
  const { warehouses } = useWarehouses();

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const activeCustomers = customers.filter(customer => customer.status === 'active').length;
  const activeWarehouses = warehouses.filter(warehouse => warehouse.status === 'active').length;

  const recentBills = bills.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="本月总收入"
          value={`¥${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="完成订单"
          value={completedOrders}
          change="+8.2%"
          changeType="positive"
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="活跃货主"
          value={activeCustomers}
          change="+5.1%"
          changeType="positive"
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="运营仓库"
          value={activeWarehouses}
          change="0%"
          changeType="positive"
          icon={<Warehouse className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* 图表和最近账单 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收入趋势图 */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">收入趋势</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>图表功能开发中...</p>
            </div>
          </div>
        </div>

        {/* 最近账单 */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最近账单</h3>
          <div className="space-y-3">
            {recentBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{bill.customerName}</p>
                  <p className="text-sm text-gray-500">{bill.billNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">¥{bill.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {bill.status === 'paid' ? '已支付' :
                     bill.status === 'sent' ? '已发送' :
                     bill.status === 'draft' ? '草稿' : '逾期'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 仓库使用率 */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">仓库使用率</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map((warehouse) => {
            const utilization = (warehouse.usedCapacity / warehouse.capacity) * 100;
            return (
              <div key={warehouse.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{warehouse.name}</h4>
                  <span className="text-sm text-gray-500">{utilization.toFixed(1)}%</span>
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
                <p className="text-xs text-gray-500 mt-1">
                  {warehouse.usedCapacity} / {warehouse.capacity} 板位
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}