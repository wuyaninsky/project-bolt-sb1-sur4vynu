import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  sortConfig?: { key: string; order: 'asc' | 'desc' };
}

export default function Table<T extends Record<string, any>>({ 
  columns, 
  data, 
  loading = false,
  onSort,
  sortConfig
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const order = sortConfig?.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    onSort(key, order);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${column.width ? `w-${column.width}` : ''}`}
                onClick={() => column.sortable && handleSort(column.key.toString())}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${
                          sortConfig?.key === column.key && sortConfig.order === 'asc' 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === column.key && sortConfig.order === 'desc' 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                暂无数据
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key.toString()} className="px-6 py-4 whitespace-nowrap">
                    {column.render 
                      ? column.render(row[column.key as keyof T], row)
                      : row[column.key as keyof T]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}