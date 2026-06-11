import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { useFilterOptions } from '../../hooks/useData';

const Select = ({ value, onChange, children, style }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    className="inp" style={{ width: 'auto', padding: '6px 10px', fontSize: 12, ...style }}>
    {children}
  </select>
);

const FilterBar = () => {
  const { filters, update, reset, hasActive } = useFilters();
  const { options } = useFilterOptions();
  const [expanded, setExpanded] = useState(false);

  const activeCount = [
    filters.category !== 'all',
    filters.region !== 'all',
    filters.status !== 'all',
    filters.customerSegment !== 'all',
    filters.salesChannel !== 'all',
    filters.paymentMethod !== 'all',
    !!filters.minAmount,
    !!filters.maxAmount,
  ].filter(Boolean).length;

  return (
    <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
      {/* ── Row 1: always visible ── */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filter</span>
        </div>

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>From</span>
          <input type="date" value={filters.startDate} onChange={e => update('startDate', e.target.value)}
            className="inp" style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>To</span>
          <input type="date" value={filters.endDate} onChange={e => update('endDate', e.target.value)}
            className="inp" style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }} />
        </div>

        {/* Category */}
        <Select value={filters.category} onChange={v => update('category', v)}>
          <option value="all">All Categories</option>
          {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>

        {/* Region */}
        <Select value={filters.region} onChange={v => update('region', v)}>
          <option value="all">All Regions</option>
          {options.regions.map(r => <option key={r} value={r}>{r}</option>)}
        </Select>

        {/* More filters toggle */}
        <button onClick={() => setExpanded(p => !p)}
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px', marginLeft: 'auto',
            borderColor: expanded ? 'var(--amber)' : undefined,
            color: expanded ? 'var(--amber)' : undefined,
            background: expanded ? 'var(--amber-bg)' : undefined }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          More Filters
          {activeCount > 0 && (
            <span style={{ background: 'var(--amber)', color: '#fff', borderRadius: '50%',
              width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, marginLeft: 2 }}>
              {activeCount}
            </span>
          )}
        </button>

        {hasActive && (
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* ── Row 2: expanded filters ── */}
      {expanded && (
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border-soft)',
          background: 'var(--bg-soft)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>

          {/* Status */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Status</div>
            <Select value={filters.status} onChange={v => update('status', v)}>
              <option value="all">All Statuses</option>
              {(options.statuses?.length ? options.statuses : ['completed','pending','cancelled','refunded'])
                .map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </Select>
          </div>

          {/* Customer Segment */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Segment</div>
            <Select value={filters.customerSegment} onChange={v => update('customerSegment', v)}>
              <option value="all">All Segments</option>
              {(options.customerSegments?.length ? options.customerSegments : ['Regular','Premium','VIP','New'])
                .map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>

          {/* Sales Channel */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Channel</div>
            <Select value={filters.salesChannel} onChange={v => update('salesChannel', v)}>
              <option value="all">All Channels</option>
              {(options.salesChannels?.length ? options.salesChannels : ['Online','Retail','Partner'])
                .map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>

          {/* Payment Method */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</div>
            <Select value={filters.paymentMethod} onChange={v => update('paymentMethod', v)}>
              <option value="all">All Methods</option>
              {(options.paymentMethods?.length ? options.paymentMethods : ['Card','UPI','Net Banking','Cash','Wallet'])
                .map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
          </div>

          {/* Amount Range */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount Range (₹)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <input type="number" placeholder="Min" value={filters.minAmount}
                onChange={e => update('minAmount', e.target.value)}
                className="inp" style={{ width: 90, padding: '6px 10px', fontSize: 12 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>–</span>
              <input type="number" placeholder="Max" value={filters.maxAmount}
                onChange={e => update('maxAmount', e.target.value)}
                className="inp" style={{ width: 90, padding: '6px 10px', fontSize: 12 }} />
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginLeft: 'auto' }}>
              {[
                ['status', filters.status],
                ['customerSegment', filters.customerSegment],
                ['salesChannel', filters.salesChannel],
                ['paymentMethod', filters.paymentMethod],
              ].filter(([, v]) => v && v !== 'all').map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5,
                  padding: '3px 8px', borderRadius: 100, background: 'var(--amber-bg)',
                  border: '1px solid var(--amber-border)', fontSize: 11, color: 'var(--amber)', fontWeight: 500 }}>
                  {v}
                  <button onClick={() => update(k, 'all')} style={{ background: 'none', border: 'none',
                    cursor: 'pointer', color: 'var(--amber)', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              {filters.minAmount && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 100,
                  background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', fontSize: 11, color: 'var(--amber)', fontWeight: 500 }}>
                  ₹{filters.minAmount}+
                  <button onClick={() => update('minAmount', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--amber)', padding: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
