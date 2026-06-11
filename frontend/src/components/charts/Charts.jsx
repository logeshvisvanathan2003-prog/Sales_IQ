import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useRevenueTrend, useByCategory, useByRegion, useOrderStatus } from '../../hooks/useData';
import { useFilters } from '../../context/FilterContext';
import { fmtCurrency, fmtNum } from '../../utils/format';
import { ChartSk } from '../ui/Skeleton';

const PALETTE = ['#C96A2A','#1A8A80','#6B52A8','#C0432A','#2A7A45','#B85820','#1A6A62','#5A4298'];
const STATUS_COLORS = { completed:'#1A8A80', pending:'#C96A2A', cancelled:'#C0432A', refunded:'#6B52A8' };

const Tip = ({ active, payload, label, money }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(245,241,235,0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.75)',
      borderRadius: 12, padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(60,40,10,0.14)',
      fontFamily: 'Inter', fontSize: 12,
    }}>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || 'var(--text)', marginBottom: 2 }}>
          <span style={{ opacity: 0.7 }}>{p.name}: </span>
          <span style={{ fontWeight: 600 }}>{money ? fmtCurrency(p.value) : fmtNum(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, action, delay = 0 }) => (
  <div className="card" style={{
    padding: 22,
    animation: `fadeUp 0.45s ${delay}ms cubic-bezier(.22,1,.36,1) both`,
    transition: 'transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s cubic-bezier(.22,1,.36,1)',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const ErrState = ({ msg }) => (
  <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{msg}</p>
  </div>
);

const ToggleBtns = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 2, background: 'rgba(200,185,160,0.25)', borderRadius: 9, padding: 3, backdropFilter: 'blur(8px)' }}>
    {options.map(o => (
      <button key={o} onClick={() => onChange(o)} style={{
        padding: '4px 11px', borderRadius: 7, border: 'none', cursor: 'pointer',
        fontSize: 11, fontWeight: 600, transition: 'all 0.18s',
        background: value === o ? 'rgba(255,255,255,0.85)' : 'transparent',
        color: value === o ? 'var(--amber)' : 'var(--text-muted)',
        boxShadow: value === o ? '0 1px 6px rgba(60,40,10,0.10)' : 'none',
      }}>{o.charAt(0).toUpperCase() + o.slice(1)}</button>
    ))}
  </div>
);

export const RevenueTrendChart = ({ delay = 0 }) => {
  const { filters } = useFilters();
  const [groupBy, setGroupBy] = useState('month');
  const { data, loading, error } = useRevenueTrend(filters, groupBy);
  if (loading) return <ChartSk height={220} />;
  return (
    <ChartCard title="Revenue Trend" subtitle="Completed orders over time" delay={delay}
      action={<ToggleBtns options={['day', 'week', 'month']} value={groupBy} onChange={setGroupBy} />}>
      {error ? <ErrState msg={error} /> : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data || []} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C96A2A" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#C96A2A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,160,130,0.18)" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v, true)} />
            <Tooltip content={<Tip money />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C96A2A" strokeWidth={2.5}
              fill="url(#aGrad)" dot={false} activeDot={{ r: 5, fill: '#C96A2A', stroke: '#fff', strokeWidth: 2.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export const CategoryChart = ({ delay = 0 }) => {
  const { filters } = useFilters();
  const { data, loading, error } = useByCategory(filters);
  if (loading) return <ChartSk height={220} />;
  const rows = (data || []).map((d, i) => ({ ...d, revenue: parseFloat(d.revenue), fill: PALETTE[i % PALETTE.length] }));
  return (
    <ChartCard title="Sales by Category" subtitle="Revenue by product category" delay={delay}>
      {error ? <ErrState msg={error} /> : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 30, left: 4 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,160,130,0.18)" vertical={false} />
            <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v, true)} />
            <Tooltip content={<Tip money />} />
            <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
              {rows.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export const RegionChart = ({ delay = 0 }) => {
  const { filters } = useFilters();
  const { data, loading, error } = useByRegion(filters);
  if (loading) return <ChartSk height={220} />;
  const rows = (data || []).map((d, i) => ({ ...d, revenue: parseFloat(d.revenue), fill: PALETTE[i % PALETTE.length] }));
  const R = Math.PI / 180;
  const lbl = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    return (
      <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
        fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <ChartCard title="Sales by Region" subtitle="Geographic revenue distribution" delay={delay}>
      {error ? <ErrState msg={error} /> : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <ResponsiveContainer width="55%" height={200} minWidth={130}>
            <PieChart>
              <Pie data={rows} cx="50%" cy="50%" innerRadius={46} outerRadius={82}
                dataKey="revenue" labelLine={false} label={lbl}>
                {rows.map((e, i) => <Cell key={i} fill={e.fill} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<Tip money />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, minWidth: 100 }}>
            {rows.slice(0, 7).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{d.region}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>{fmtCurrency(d.revenue, true)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export const OrderStatusChart = ({ delay = 0 }) => {
  const { filters } = useFilters();
  const { data, loading, error } = useOrderStatus(filters);
  if (loading) return <ChartSk height={220} />;
  const rows = (data || []).map(d => ({ ...d, count: parseInt(d.count), fill: STATUS_COLORS[d.status] || '#888' }));
  const total = rows.reduce((s, d) => s + d.count, 0);
  return (
    <ChartCard title="Order Status" subtitle="Distribution by fulfillment status" delay={delay}>
      {error ? <ErrState msg={error} /> : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {rows.map((d, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 12,
                background: `${d.fill}14`,
                border: `1px solid ${d.fill}28`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(60,40,10,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: d.fill, letterSpacing: '-0.5px' }}>{fmtNum(d.count, true)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 2 }}>{d.status}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: d.fill, marginTop: 2 }}>
                  {total > 0 ? ((d.count / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={rows} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barSize={28}>
              <XAxis dataKey="status" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={s => s.charAt(0).toUpperCase() + s.slice(1)} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" name="Orders" radius={[5, 5, 0, 0]}>
                {rows.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};
