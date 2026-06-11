import React, { useState } from 'react';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Header from './components/layout/Header';
import FilterBar from './components/dashboard/FilterBar';
import SummaryCards from './components/dashboard/SummaryCards';
import { RevenueTrendChart, CategoryChart, RegionChart, OrderStatusChart } from './components/charts/Charts';
import TransactionsTable from './components/dashboard/TransactionsTable';
import AddTransactionModal from './components/dashboard/AddTransactionModal';
import { FilterProvider } from './context/FilterContext';
import AuthPage from './components/dashboard/Authpage';
import './index.css';

const Dashboard = ({ user, onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleSuccess = () => setRefreshKey(k => k + 1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-soft)' }}>
      <Header onAddTxn={() => setShowModal(true)} user={user} onLogout={onLogout} />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 16px 40px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.5px' }}>
            Sales Analytics
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Real-time insights · PostgreSQL backend · All data live
          </p>
        </div>
        <FilterBar />
        <SummaryCards />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: 16, marginBottom: 20
        }}>
          <RevenueTrendChart delay={0} />
          <CategoryChart delay={60} />
          <RegionChart delay={120} />
          <OrderStatusChart delay={180} />
        </div>
        <TransactionsTable refreshKey={refreshKey} onAddClick={() => setShowModal(true)} />
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            SalesIQ · React + Node.js + PostgreSQL · Real-time data
          </p>
        </div>
      </main>
      {showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('salesiq_user')); } catch { return null; }
  });

  const handleLogin = (userData) => {
    localStorage.setItem('salesiq_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('salesiq_user');
    setUser(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <ErrorBoundary>
      <FilterProvider>
        <Dashboard user={user} onLogout={handleLogout} />
      </FilterProvider>
    </ErrorBoundary>
  );
};

export default App;
