import React, { useState } from 'react';

/* ── Shared styles injected once ─────────────────────────── */
const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

.auth-root {
  min-height: 100vh;
  background: #FAF8F5;
  display: flex;
  font-family: 'DM Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow: hidden;
}

/* left decorative panel */
.auth-panel {
  width: 44%;
  background: linear-gradient(160deg, #2C2C2A 0%, #1A1A18 60%, #0F0F0E 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.auth-panel-orb1 {
  position: absolute; top: -80px; left: -80px;
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(207,158,118,.18), transparent 70%);
  pointer-events: none;
}
.auth-panel-orb2 {
  position: absolute; bottom: 40px; right: -60px;
  width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(29,158,117,.14), transparent 70%);
  pointer-events: none;
}
.auth-panel-orb3 {
  position: absolute; top: 45%; left: 30%;
  width: 180px; height: 180px; border-radius: 50%;
  background: radial-gradient(circle, rgba(127,119,221,.1), transparent 70%);
  pointer-events: none;
}
.auth-brand {
  display: flex; align-items: center; gap: 12px; position: relative; z-index: 1;
}
.auth-brand-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: linear-gradient(135deg, #CF9E76, #D85A30);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(207,158,118,.35);
}
.auth-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 22px; font-weight: 600; color: #F5F0E8;
  letter-spacing: -.3px;
}
.auth-brand-sub { font-size: 12px; color: rgba(245,240,232,.45); margin-top: -2px; }
.auth-panel-mid { position: relative; z-index: 1; }
.auth-panel-headline {
  font-family: 'Playfair Display', serif;
  font-size: 36px; font-weight: 500;
  color: #F5F0E8; line-height: 1.25;
  margin-bottom: 18px;
}
.auth-panel-headline span { color: #CF9E76; }
.auth-panel-desc { font-size: 14px; color: rgba(245,240,232,.5); line-height: 1.65; max-width: 300px; }
.auth-stats { display: flex; gap: 28px; position: relative; z-index: 1; }
.auth-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 600; color: #CF9E76;
}
.auth-stat-lbl { font-size: 11px; color: rgba(245,240,232,.4); margin-top: 1px; letter-spacing: .05em; text-transform: uppercase; }

/* right form area */
.auth-form-area {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 48px 40px;
}
.auth-card {
  width: 100%; max-width: 420px;
  background: #FFFFFF;
  border: 1px solid #E8E4DC;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 40px rgba(44,44,42,.07);
  animation: authFadeIn .4s ease forwards;
}
@keyframes authFadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.auth-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 600; color: #2C2C2A;
  margin-bottom: 6px;
}
.auth-card-sub { font-size: 13px; color: #888780; margin-bottom: 28px; }

.auth-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.auth-label { font-size: 12px; font-weight: 600; color: #5F5E5A; letter-spacing: .03em; }
.auth-input-wrap { position: relative; }
.auth-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.auth-input {
  width: 100%;
  background: #F9F7F4;
  border: 1.5px solid #E5E2DA;
  border-radius: 10px;
  padding: 11px 14px 11px 38px;
  font-size: 14px; color: #2C2C2A;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color .18s, box-shadow .18s, background .18s;
}
.auth-input:focus {
  border-color: #CF9E76;
  box-shadow: 0 0 0 3px rgba(207,158,118,.14);
  background: #FFFFFF;
}
.auth-input::placeholder { color: #B8B5AE; }
.auth-input.err { border-color: #E24B4A; box-shadow: 0 0 0 3px rgba(226,75,74,.1); }
.auth-eye {
  position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #888780;
  display: flex; align-items: center; padding: 0;
  transition: color .18s;
}
.auth-eye:hover { color: #CF9E76; }
.auth-err { font-size: 11px; color: #E24B4A; margin-top: 3px; }

.auth-btn {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #CF9E76, #B07D50);
  border: none; border-radius: 10px;
  color: #fff; font-size: 14px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 4px 14px rgba(207,158,118,.3);
  margin-top: 8px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.auth-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(207,158,118,.4); }
.auth-btn:active { transform: translateY(0); }
.auth-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }

.auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.auth-divider-line { flex: 1; height: 1px; background: #E8E4DC; }
.auth-divider-text { font-size: 11px; color: #B8B5AE; font-weight: 500; letter-spacing: .05em; }

.auth-switch { text-align: center; font-size: 13px; color: #888780; margin-top: 20px; }
.auth-switch-link { color: #B07D50; font-weight: 600; cursor: pointer; background: none; border: none; font-family: 'DM Sans',sans-serif; font-size: 13px; padding: 0; transition: color .18s; }
.auth-switch-link:hover { color: #CF9E76; }

.auth-remember { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.auth-checkbox { width: 16px; height: 16px; accent-color: #CF9E76; cursor: pointer; }
.auth-remember-lbl { font-size: 13px; color: #5F5E5A; cursor: pointer; }
.auth-forgot { font-size: 12px; color: #B07D50; cursor: pointer; background: none; border: none; font-family: 'DM Sans',sans-serif; padding: 0; margin-left: auto; }
.auth-forgot:hover { color: #CF9E76; }

.auth-success {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px; border-radius: 8px;
  background: rgba(29,158,117,.1); border: 1px solid rgba(29,158,117,.25);
  font-size: 13px; color: #0F6E56; font-weight: 500;
  margin-bottom: 16px; animation: authFadeIn .3s ease;
}
.auth-global-err {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px; border-radius: 8px;
  background: rgba(226,75,74,.08); border: 1px solid rgba(226,75,74,.22);
  font-size: 13px; color: #E24B4A; font-weight: 500;
  margin-bottom: 16px; animation: authFadeIn .3s ease;
}

.auth-terms { font-size: 11px; color: #B8B5AE; text-align: center; margin-top: 16px; line-height: 1.6; }
.auth-terms span { color: #B07D50; cursor: pointer; }

/* live indicator */
.auth-live { display: flex; align-items: center; gap: 6px; }
.auth-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #1D9E75; animation: liveP 2s ease-in-out infinite; }
@keyframes liveP { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
.auth-live-txt { font-size: 11px; color: rgba(245,240,232,.4); letter-spacing: .07em; }

/* strength bar */
.str-track { height: 4px; border-radius: 99px; background: #E8E4DC; margin-top: 6px; overflow: hidden; }
.str-fill { height: 100%; border-radius: 99px; transition: width .3s ease, background .3s ease; }
.str-txt { font-size: 11px; margin-top: 3px; font-weight: 500; }

/* responsive */
@media(max-width: 900px) {
  .auth-panel { display: none; }
  .auth-form-area { padding: 28px 20px; }
  .auth-card { padding: 28px 24px; }
}
@media(max-width: 480px) {
  .auth-form-area { padding: 16px; align-items: flex-start; padding-top: 32px; }
  .auth-card { border-radius: 16px; padding: 24px 18px; }
  .auth-card-title { font-size: 22px; }
}
`;

/* ── Password strength ──────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { score:1, label:'Weak',    color:'#E24B4A' },
    { score:2, label:'Fair',    color:'#CF9E76' },
    { score:3, label:'Good',    color:'#F0B429' },
    { score:4, label:'Strong',  color:'#1D9E75' },
  ];
  return map[s-1] || { score:0, label:'', color:'' };
};

/* ── Eye icon ───────────────────────────────────────────── */
const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   LEFT PANEL
═══════════════════════════════════════════════════════════ */
const AuthPanel = () => (
  <div className="auth-panel">
    <div className="auth-panel-orb1"/><div className="auth-panel-orb2"/><div className="auth-panel-orb3"/>
    <div className="auth-brand">
      <div className="auth-brand-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div>
        <div className="auth-brand-name">SalesIQ</div>
        <div className="auth-brand-sub">Analytics Dashboard</div>
      </div>
    </div>
    <div className="auth-panel-mid">
      <div className="auth-panel-headline">
        Turn your sales data into <span>real insights</span>
      </div>
      <div className="auth-panel-desc">
        Track revenue, monitor transactions, and understand your customers — all in one live dashboard connected to your PostgreSQL database.
      </div>
    </div>
    <div>
      <div className="auth-stats">
        {[
          { num: '₹9.1L', lbl: 'Total Revenue' },
          { num: '19',    lbl: 'Transactions'  },
          { num: '16',    lbl: 'Customers'      },
        ].map(s => (
          <div key={s.lbl}>
            <div className="auth-stat-num">{s.num}</div>
            <div className="auth-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }} className="auth-live">
        <div className="auth-live-dot"/>
        <span className="auth-live-txt">LIVE DATABASE</span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   LOGIN FORM
═══════════════════════════════════════════════════════════ */
const LoginForm = ({ onLogin, onGoRegister }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [globalErr,setGlobalErr]= useState('');

  const validate = () => {
    const e = {};
    if (!email.trim())                          e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))       e.email    = 'Enter a valid email';
    if (!password)                              e.password = 'Password is required';
    else if (password.length < 6)              e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setGlobalErr(''); setLoading(true);
    // Simulate auth — replace with real API call
    await new Promise(r => setTimeout(r, 900));
    // Demo: any valid email + password works
    if (password === 'wrong') {
      setGlobalErr('Invalid email or password. Please try again.');
      setLoading(false); return;
    }
    setLoading(false);
    onLogin({ email, name: email.split('@')[0] });
  };

  return (
    <div className="auth-card">
      <div className="auth-card-title">Welcome back</div>
      <div className="auth-card-sub">Sign in to your SalesIQ account</div>

      {globalErr && (
        <div className="auth-global-err">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {globalErr}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="auth-field">
          <label className="auth-label">Email address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8B5AE" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input className={`auth-input${errors.email?' err':''}`} type="email"
              placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setErrors(v=>({...v,email:''}));}}/>
          </div>
          {errors.email && <span className="auth-err">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8B5AE" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input className={`auth-input${errors.password?' err':''}`}
              type={showPw?'text':'password'}
              placeholder="Enter your password" value={password}
              onChange={e=>{setPassword(e.target.value);setErrors(v=>({...v,password:''}));}}/>
            <button type="button" className="auth-eye" onClick={()=>setShowPw(v=>!v)}>
              <EyeIcon show={showPw}/>
            </button>
          </div>
          {errors.password && <span className="auth-err">{errors.password}</span>}
        </div>

        {/* Remember + Forgot */}
        <div className="auth-remember" style={{marginBottom:20}}>
          <input type="checkbox" id="rem" className="auth-checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>
          <label htmlFor="rem" className="auth-remember-lbl">Remember me</label>
          <button type="button" className="auth-forgot">Forgot password?</button>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{animation:'spin 1s linear infinite'}}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>Signing in…</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>Sign In</>
          )}
        </button>
      </form>

      <div className="auth-switch">
        Don't have an account?{' '}
        <button className="auth-switch-link" onClick={onGoRegister}>Create one →</button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   REGISTER FORM
═══════════════════════════════════════════════════════════ */
const RegisterForm = ({ onRegister, onGoLogin }) => {
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [showCf,  setShowCf]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name     = 'Full name is required';
    if (!form.email.trim())                       e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = 'Enter a valid email';
    if (!form.password)                           e.password = 'Password is required';
    else if (form.password.length < 8)            e.password = 'At least 8 characters';
    if (form.password !== form.confirm)           e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => onRegister({ email: form.email, name: form.name }), 1200);
  };

  const str = getStrength(form.password);

  return (
    <div className="auth-card">
      <div className="auth-card-title">Create account</div>
      <div className="auth-card-sub">Get started with SalesIQ for free</div>

      {success && (
        <div className="auth-success">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Account created! Redirecting to dashboard…
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="auth-field">
          <label className="auth-label">Full name</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8B5AE" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input className={`auth-input${errors.name?' err':''}`} type="text"
              placeholder="Logesh Visvanathan" value={form.name} onChange={e=>set('name',e.target.value)}/>
          </div>
          {errors.name && <span className="auth-err">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-label">Email address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8B5AE" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input className={`auth-input${errors.email?' err':''}`} type="email"
              placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)}/>
          </div>
          {errors.email && <span className="auth-err">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8B5AE" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input className={`auth-input${errors.password?' err':''}`}
              type={showPw?'text':'password'}
              placeholder="Min. 8 characters" value={form.password} onChange={e=>set('password',e.target.value)}/>
            <button type="button" className="auth-eye" onClick={()=>setShowPw(v=>!v)}>
              <EyeIcon show={showPw}/>
            </button>
          </div>
          {form.password && (
            <>
              <div className="str-track">
                <div className="str-fill" style={{ width:`${(str.score/4)*100}%`, background:str.color }}/>
              </div>
              <div className="str-txt" style={{ color:str.color }}>{str.label}</div>
            </>
          )}
          {errors.password && <span className="auth-err">{errors.password}</span>}
        </div>

        {/* Confirm */}
        <div className="auth-field">
          <label className="auth-label">Confirm password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8B5AE" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <input className={`auth-input${errors.confirm?' err':''}`}
              type={showCf?'text':'password'}
              placeholder="Repeat password" value={form.confirm} onChange={e=>set('confirm',e.target.value)}/>
            <button type="button" className="auth-eye" onClick={()=>setShowCf(v=>!v)}>
              <EyeIcon show={showCf}/>
            </button>
          </div>
          {errors.confirm && <span className="auth-err">{errors.confirm}</span>}
        </div>

        <button type="submit" className="auth-btn" disabled={loading||success} style={{marginTop:4}}>
          {loading ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{animation:'spin 1s linear infinite'}}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>Creating account…</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>Create Account</>
          )}
        </button>
      </form>

      <div className="auth-terms">
        By creating an account you agree to our{' '}
        <span>Terms of Service</span> and <span>Privacy Policy</span>
      </div>
      <div className="auth-switch">
        Already have an account?{' '}
        <button className="auth-switch-link" onClick={onGoLogin}>Sign in →</button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN AUTH PAGE — exported
═══════════════════════════════════════════════════════════ */
const AuthPage = ({ onLogin }) => {
  const [view, setView] = useState('login'); // 'login' | 'register'

  return (
    <>
      <style>{AUTH_CSS}</style>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div className="auth-root">
        <AuthPanel/>
        <div className="auth-form-area">
          {view === 'login' ? (
            <LoginForm
              onLogin={onLogin}
              onGoRegister={() => setView('register')}
            />
          ) : (
            <RegisterForm
              onRegister={onLogin}
              onGoLogin={() => setView('login')}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;