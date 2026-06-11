import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { useFilterOptions } from '../../hooks/useData';

const Sel = ({ value, onChange, children }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="inp"
    style={{ width: 'auto', padding: '7px 11px', fontSize: 12 }}>
    {children}
  </select>
);

const FilterBar = () => {
  const { filters, update, reset, hasActive } = useFilters();
  const { options } = useFilterOptions();
  const [expanded, setExpanded] = useState(false);

  const activeCount = [
    filters.category !== 'all', filters.region !== 'all',
    filters.status !== 'all', filters.customerSegment !== 'all',
    filters.salesChannel !== 'all', filters.paymentMethod !== 'all',
    !!filters.minAmount, !!filters.maxAmount,
  ].filter(Boolean).length;

  return (
    <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
      {/* Row 1 */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Filter</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>From</span>
          <input type="date" value={filters.startDate} onChange={e => update('startDate', e.target.value)} className="inp" style={{ width: 'auto', padding: '7px 11px', fontSize: 12 }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>To</span>
          <input type="date" value={filters.endDate} onChange={e => update('endDate', e.target.value)} className="inp" style={{ width: 'auto', padding: '7px 11px', fontSize: 12 }} />
        </div>

        <Sel value={filters.category} onChange={v => update('category', v)}>
          <option value="all">All Categories</option>
          {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </Sel>

        <Sel value={filters.region} onChange={v => update('region', v)}>
          <option value="all">All Regions</option>
          {options.regions.map(r => <option key={r} value={r}>{r}</option>)}
        </Sel>

        <button onClick={() => setExpanded(p => !p)} className="btn btn-ghost"
          style={{ fontSize: 12, padding: '7px 13px', marginLeft: 'auto',
            ...(expanded ? { borderColor: 'var(--amber-border)', color: 'var(--amber)', background: 'var(--amber-bg)' } : {}) }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          More Filters
          {activeCount > 0 && (
            <span style={{ background: 'var(--amber)', color: '#fff', borderRadius: '50%', width: 17, height: 17, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {activeCount}
            </span>
          )}
        </button>

        {hasActive && (
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '7px 13px', fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
            Reset
          </button>
        )}
      </div>

      {/* Expanded row */}
      {expanded && (
        <div style={{ padding: '14px 16px 16px', borderTop: '1px solid rgba(180,160,130,0.15)', background: 'rgba(200,185,160,0.12)', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          {[
            { key: 'status', label: 'Order Status', opts: options.statuses?.length ? options.statuses : ['completed','pending','cancelled','refunded'], all: 'All Statuses' },
            { key: 'customerSegment', label: 'Customer Segment', opts: options.customerSegments?.length ? options.customerSegments : ['Regular','Premium','VIP','New'], all: 'All Segments' },
            { key: 'salesChannel', label: 'Sales Channel', opts: options.salesChannels?.length ? options.salesChannels : ['Online','Retail','Partner'], all: 'All Channels' },
            { key: 'paymentMethod', label: 'Payment Method', opts: options.paymentMethods?.length ? options.paymentMethods : ['Card','UPI','Net Banking','Cash','Wallet'], all: 'All Methods' },
          ].map(({ key, label, opts, all }) => (
            <div key={key}>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <Sel value={filters[key]} onChange={v => update(key, v)}>
                <option value="all">{all}</option>
                {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </Sel>
            </div>
          ))}

          <div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount Range (₹)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" placeholder="Min" value={filters.minAmount} onChange={e => update('minAmount', e.target.value)} className="inp" style={{ width: 88, padding: '7px 10px', fontSize: 12 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>–</span>
              <input type="number" placeholder="Max" value={filters.maxAmount} onChange={e => update('maxAmount', e.target.value)} className="inp" style={{ width: 88, padding: '7px 10px', fontSize: 12 }} />
            </div>
          </div>

          {/* Active chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginLeft: 'auto' }}>
              {[['status','all'],['customerSegment','all'],['salesChannel','all'],['paymentMethod','all']]
                .filter(([k]) => filters[k] && filters[k] !== 'all')
                .map(([k]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 100, background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>
                    {filters[k]}
                    <button onClick={() => update(k, 'all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--amber)', padding: 0, display: 'flex' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
