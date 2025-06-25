import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './components/Dashboard/DashboardPage';
import UserManagement from './components/Users/UserManagement';
import WarehouseManagement from './components/Warehouses/WarehouseManagement';
import CustomerManagement from './components/Customers/CustomerManagement';
import OrderList from './components/Orders/OrderList';
import FeeConfigManagement from './components/Fees/FeeConfigManagement';
import BillQuery from './components/Bills/BillQuery';

const pageComponents = {
  dashboard: DashboardPage,
  users: UserManagement,
  warehouses: WarehouseManagement,
  customers: CustomerManagement,
  orders: OrderList,
  'fee-configs': FeeConfigManagement,
  fees: FeeConfigManagement, // 费用管理使用相同组件
  bills: BillQuery
};

const pageTitles = {
  dashboard: '仪表板',
  users: '用户管理',
  warehouses: '仓库管理',
  customers: '货主管理',
  orders: '订单数据',
  'fee-configs': '费用字段管理',
  fees: '费用管理',
  bills: '财务账单查询'
};

function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const PageComponent = pageComponents[currentPage as keyof typeof pageComponents] || DashboardPage;
  const pageTitle = pageTitles[currentPage as keyof typeof pageTitles] || '仪表板';

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;