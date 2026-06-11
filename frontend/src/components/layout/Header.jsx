import React, { useState, useRef, useEffect } from 'react';

const Header = ({ onAddTxn, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials = user?.name ? user.name.slice(0,2).toUpperCase() : user?.email?.slice(0,2).toUpperCase() || 'SQ';
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <header style={{
      background: 'rgba(240,237,232,0.72)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      borderBottom: '1px solid rgba(255,255,255,0.65)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 1px 0 rgba(180,160,130,0.15), 0 4px 24px rgba(60,40,10,0.06)',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 62, gap: 16 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(145deg, #D4782A 0%, #A84818 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 12px rgba(201,106,42,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px', lineHeight: 1.1 }}>SalesIQ</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>Analytics Dashboard</div>
            </div>
          </div>

          {/* Live pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 11px', borderRadius: 100,
            background: 'rgba(26,138,128,0.10)',
            border: '1px solid rgba(26,138,128,0.22)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10.5, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.06em' }}>LIVE</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Add Transaction */}
          <button onClick={onAddTxn} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="add-txn-label">Add Transaction</span>
          </button>

          {/* Avatar dropdown */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(v => !v)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4782A, #A84818)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              border: '2px solid rgba(255,255,255,0.5)',
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 2px 10px rgba(201,106,42,0.30)',
              transition: 'transform 0.18s, box-shadow 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,106,42,0.40)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(201,106,42,0.30)'; }}
              title={displayName}>
              {initials}
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                background: 'rgba(245,241,235,0.92)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.75)',
                borderRadius: 16,
                boxShadow: '0 12px 40px rgba(60,40,10,0.16), 0 2px 8px rgba(60,40,10,0.08)',
                minWidth: 220, overflow: 'hidden', zIndex: 999,
                animation: 'slideDown 0.18s cubic-bezier(.22,1,.36,1)',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(180,160,130,0.18)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #D4782A, #A84818)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 1 }}>{displayName}</div>
                      {displayEmail && <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayEmail}</div>}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '6px 0' }}>
                  <button onClick={() => { setMenuOpen(false); onAddTxn?.(); }}
                    style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,106,42,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Transaction
                  </button>
                  <div style={{ height: 1, background: 'rgba(180,160,130,0.15)', margin: '4px 12px' }} />
                  <button onClick={() => { setMenuOpen(false); onLogout?.(); }}
                    style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--coral)', fontWeight: 500, textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--coral-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(0.8)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:480px){ .add-txn-label{display:none} }
      `}</style>
    </header>
  );
};

export default Header;
