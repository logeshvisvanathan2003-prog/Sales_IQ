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

const BgOrbs = () => (
  <>
    <div className="bg-orb" style={{ width: 520, height: 520, background: 'radial-gradient(circle, #D4782A, transparent)', top: '-120px', left: '10%', animationDelay: '0s' }} />
    <div className="bg-orb" style={{ width: 420, height: 420, background: 'radial-gradient(circle, #1A8A80, transparent)', bottom: '10%', right: '8%', animationDelay: '3s' }} />
    <div className="bg-orb" style={{ width: 320, height: 320, background: 'radial-gradient(circle, #6B52A8, transparent)', top: '45%', left: '55%', animationDelay: '6s' }} />
  </>
);

const Dashboard = ({ user, onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <BgOrbs />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header onAddTxn={() => setShowModal(true)} user={user} onLogout={onLogout} />
        <main style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 24px 48px' }}>

          {/* Page title */}
          <div className="anim-1" style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.6px', marginBottom: 4 }}>
              Sales Analytics
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Real-time insights · PostgreSQL backend · All data live
            </p>
          </div>

          <div className="anim-2"><FilterBar /></div>
          <div className="anim-3"><SummaryCards /></div>

          {/* Charts 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: 16, marginBottom: 20 }}>
            <RevenueTrendChart delay={0} />
            <CategoryChart delay={60} />
            <RegionChart delay={120} />
            <OrderStatusChart delay={180} />
          </div>

          <TransactionsTable refreshKey={refreshKey} onAddClick={() => setShowModal(true)} />

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>SalesIQ · React + Node.js + PostgreSQL</p>
          </div>
        </main>
      </div>

      {showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={() => setRefreshKey(k => k + 1)} />
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('salesiq_user')); } catch { return null; }
  });

  if (!user) return <AuthPage onLogin={(u) => { localStorage.setItem('salesiq_user', JSON.stringify(u)); setUser(u); }} />;

  return (
    <ErrorBoundary>
      <FilterProvider>
        <Dashboard user={user} onLogout={() => { localStorage.removeItem('salesiq_user'); setUser(null); }} />
      </FilterProvider>
    </ErrorBoundary>
  );
};

export default App;
