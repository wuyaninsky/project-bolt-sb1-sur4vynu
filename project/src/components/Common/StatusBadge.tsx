import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'warehouse' | 'customer' | 'order' | 'bill';
}

const statusConfig = {
  user: {
    active: { label: '正常', color: 'bg-green-100 text-green-800' },
    inactive: { label: '禁用', color: 'bg-red-100 text-red-800' }
  },
  warehouse: {
    active: { label: '正常', color: 'bg-green-100 text-green-800' },
    inactive: { label: '停用', color: 'bg-red-100 text-red-800' }
  },
  customer: {
    active: { label: '正常', color: 'bg-green-100 text-green-800' },
    inactive: { label: '停用', color: 'bg-red-100 text-red-800' }
  },
  order: {
    pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: '处理中', color: 'bg-blue-100 text-blue-800' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' }
  },
  bill: {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
    sent: { label: '已发送', color: 'bg-blue-100 text-blue-800' },
    paid: { label: '已支付', color: 'bg-green-100 text-green-800' },
    overdue: { label: '逾期', color: 'bg-red-100 text-red-800' }
  }
};

export default function StatusBadge({ status, type = 'user' }: StatusBadgeProps) {
  const config = statusConfig[type]?.[status as keyof typeof statusConfig[typeof type]];
  
  if (!config) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}