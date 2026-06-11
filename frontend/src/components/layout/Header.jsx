import React, { useState, useRef, useEffect } from 'react';

const Header = ({ onAddTxn, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'SQ';

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid var(--border-soft)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 1px 8px rgba(26,23,20,0.06)'
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 12 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #D4851A, #C9502A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>SalesIQ</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'none' }} className="header-subtitle">Analytics Dashboard</div>
            </div>
          </div>

          {/* Live badge — hidden on very small */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="live-badge">
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>LIVE</span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Add Transaction — hidden on mobile, shown via hamburger */}
            <button onClick={onAddTxn} className="btn btn-primary add-txn-btn" style={{ fontSize: 13, padding: '8px 14px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="add-txn-label">Add Transaction</span>
            </button>

            {/* User avatar + dropdown */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(v => !v)} style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--amber), var(--coral))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
                border: 'none', cursor: 'pointer', flexShrink: 0,
              }} title={displayName}>
                {initials}
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: 12, boxShadow: '0 8px 28px rgba(26,23,20,0.12)',
                  minWidth: 200, overflow: 'hidden', zIndex: 999,
                  animation: 'fadeDown 0.15s ease'
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--amber), var(--coral))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0
                      }}>{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 1 }}>{displayName}</div>
                        {displayEmail && <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayEmail}</div>}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '4px 0' }}>
                    <button onClick={() => { setMenuOpen(false); onAddTxn && onAddTxn(); }}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add Transaction
                    </button>
                    <div style={{ height: 1, background: 'var(--border-soft)', margin: '4px 0' }} />
                    <button onClick={() => { setMenuOpen(false); onLogout && onLogout(); }}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--coral)', fontWeight: 500, textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--coral-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 480px) {
          .add-txn-label { display: none; }
          .add-txn-btn { padding: 8px 10px !important; }
          .live-badge { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
