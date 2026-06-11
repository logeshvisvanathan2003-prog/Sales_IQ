import React, { useState } from 'react';

const DEMO = { email: 'admin@salesiq.com', password: 'admin123' };

const AuthPage = ({ onLogin }) => {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) { setErr('Please fill in all fields.'); return; }
    setLoading(true); setErr('');
    await new Promise(r => setTimeout(r, 700));
    if (form.email === DEMO.email && form.password === DEMO.password) {
      onLogin({ email: form.email, name: 'Admin' });
    } else {
      setErr('Invalid credentials. Try admin@salesiq.com / admin123');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: 16,
    }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #D4782A, transparent)', top: '-150px', left: '5%', filter: 'blur(90px)', opacity: 0.30, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #1A8A80, transparent)', bottom: '-100px', right: '8%', filter: 'blur(80px)', opacity: 0.28, pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
        animation: 'fadeUp 0.5s cubic-bezier(.22,1,.36,1) both',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(145deg, #D4782A, #A84818)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 6px 24px rgba(201,106,42,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.6px', marginBottom: 6 }}>SalesIQ</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sign in to your analytics dashboard</p>
        </div>

        {/* Card */}
        <div className="card-lg" style={{ padding: 32, backdropFilter: 'blur(28px) saturate(170%)', WebkitBackdropFilter: 'blur(28px) saturate(170%)' }}>
          {err && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--coral-bg)', border: '1px solid var(--coral-border)', color: 'var(--coral)', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {err}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input className="inp" type="email" placeholder="admin@salesiq.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input className="inp" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          <button className="btn btn-primary" onClick={submit} disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 600 }}>
            {loading ? (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.7s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Signing in…</>
            ) : 'Sign in'}
          </button>

          <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, background: 'rgba(200,185,160,0.25)', border: '1px solid rgba(180,160,130,0.25)' }}>
            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 3 }}>Demo credentials</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>admin@salesiq.com / admin123</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
          SalesIQ · React + Node.js + PostgreSQL
        </p>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default AuthPage;
