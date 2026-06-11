export const fmtCurrency = (v, compact=false) => {
  const n = parseFloat(v) || 0;
  if (compact) {
    if (n >= 1e7) return `₹${(n/1e7).toFixed(1)}Cr`;
    if (n >= 1e5) return `₹${(n/1e5).toFixed(1)}L`;
    if (n >= 1e3) return `₹${(n/1e3).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
  }
  return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:2 }).format(n);
};

export const fmtNum = (v, compact=false) => {
  const n = parseInt(v) || 0;
  if (compact) {
    if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`;
    return `${n}`;
  }
  return new Intl.NumberFormat('en-IN').format(n);
};

export const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};

export const fmtDateTime = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
};

export const COLORS = {
  amber: '#D4851A', coral: '#C9502A', teal: '#1A9E8F',
  purple: '#6B5EBF', blue: '#2563EB', green: '#2A8A50',
  pink: '#BE3B7A', slate: '#64748B',
};
export const PALETTE = Object.values(COLORS);
