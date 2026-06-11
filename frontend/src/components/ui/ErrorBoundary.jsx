import React from 'react';

class ErrorBoundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(e) { return { err: e }; }
  componentDidCatch(e, i) { console.error('ErrorBoundary:', e, i); }
  render() {
    if (this.state.err) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-soft)' }}>
        <div className="card p-8 text-center" style={{ maxWidth: 400 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--coral-bg)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:8, color:'var(--text)' }}>Something went wrong</h2>
          <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:20 }}>{this.state.err?.message}</p>
          <button className="btn btn-primary" onClick={() => this.setState({ err: null })}>Try Again</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
export default ErrorBoundary;
