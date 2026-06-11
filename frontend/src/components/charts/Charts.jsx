import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useRevenueTrend, useByCategory, useByRegion, useOrderStatus } from '../../hooks/useData';
import { useFilters } from '../../context/FilterContext';
import { fmtCurrency, fmtNum, PALETTE } from '../../utils/format';
import { ChartSk } from '../ui/Skeleton';

const STATUS_COLORS = { completed:'#1A9E8F', pending:'#D4851A', cancelled:'#C9502A', refunded:'#6B5EBF' };

const Tip = ({ active, payload, label, money }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', boxShadow:'var(--shadow-md)', fontFamily:'Inter', fontSize:12 }}>
      <p style={{ color:'var(--text-secondary)', fontWeight:600, marginBottom:4 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color||'var(--text)' }}>
          {p.name}: {money ? fmtCurrency(p.value) : fmtNum(p.value)}
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, action, delay=0 }) => (
  <div className="card" style={{ padding:20, animation:'fadeUp 0.4s ease both', animationDelay:`${delay}ms` }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const ErrState = ({ msg }) => (
  <div style={{ height:220, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <p style={{ fontSize:12, color:'var(--text-muted)' }}>{msg}</p>
  </div>
);

const ToggleBtns = ({ options, value, onChange }) => (
  <div style={{ display:'flex', gap:2, background:'var(--bg-muted)', borderRadius:8, padding:3 }}>
    {options.map(o => (
      <button key={o} onClick={() => onChange(o)}
        style={{
          padding:'4px 10px', borderRadius:6, border:'none', cursor:'pointer',
          fontSize:11, fontWeight:500, transition:'all 0.15s',
          background: value===o ? '#fff' : 'transparent',
          color: value===o ? 'var(--amber)' : 'var(--text-muted)',
          boxShadow: value===o ? 'var(--shadow)' : 'none'
        }}
      >{o.charAt(0).toUpperCase()+o.slice(1)}</button>
    ))}
  </div>
);

export const RevenueTrendChart = ({ delay=0 }) => {
  const { filters } = useFilters();
  const [groupBy, setGroupBy] = useState('month');
  const { data, loading, error } = useRevenueTrend(filters, groupBy);
  if (loading) return <ChartSk height={220} />;
  return (
    <ChartCard title="Revenue Trend" subtitle="Completed orders over time" delay={delay}
      action={<ToggleBtns options={['day','week','month']} value={groupBy} onChange={setGroupBy} />}>
      {error ? <ErrState msg={error} /> : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data||[]} margin={{top:4,right:4,bottom:4,left:4}}>
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4851A" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="#D4851A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false}/>
            <XAxis dataKey="period" tick={{fill:'var(--text-muted)',fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'var(--text-muted)',fontSize:10}} axisLine={false} tickLine={false}
              tickFormatter={v=>fmtCurrency(v,true)}/>
            <Tooltip content={<Tip money />}/>
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#D4851A" strokeWidth={2}
              fill="url(#aGrad)" dot={false} activeDot={{r:4,fill:'#D4851A',stroke:'#fff',strokeWidth:2}}/>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export const CategoryChart = ({ delay=0 }) => {
  const { filters } = useFilters();
  const { data, loading, error } = useByCategory(filters);
  if (loading) return <ChartSk height={220} />;
  const rows = (data||[]).map((d,i) => ({ ...d, revenue:parseFloat(d.revenue), fill:PALETTE[i%PALETTE.length] }));
  return (
    <ChartCard title="Sales by Category" subtitle="Revenue by product category" delay={delay}>
      {error ? <ErrState msg={error} /> : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rows} margin={{top:4,right:4,bottom:28,left:4}} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false}/>
            <XAxis dataKey="category" tick={{fill:'var(--text-muted)',fontSize:9}} axisLine={false}
              tickLine={false} angle={-35} textAnchor="end" interval={0}/>
            <YAxis tick={{fill:'var(--text-muted)',fontSize:10}} axisLine={false} tickLine={false}
              tickFormatter={v=>fmtCurrency(v,true)}/>
            <Tooltip content={<Tip money />}/>
            <Bar dataKey="revenue" name="Revenue" radius={[5,5,0,0]}>
              {rows.map((e,i) => <Cell key={i} fill={e.fill}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export const RegionChart = ({ delay=0 }) => {
  const { filters } = useFilters();
  const { data, loading, error } = useByRegion(filters);
  if (loading) return <ChartSk height={220} />;
  const rows = (data||[]).map((d,i) => ({ ...d, revenue:parseFloat(d.revenue), fill:PALETTE[i%PALETTE.length] }));
  const R = Math.PI/180;
  const lbl = ({ cx,cy,midAngle,innerRadius,outerRadius,percent }) => {
    if (percent < 0.06) return null;
    const r = innerRadius+(outerRadius-innerRadius)*0.5;
    return <text x={cx+r*Math.cos(-midAngle*R)} y={cy+r*Math.sin(-midAngle*R)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent*100).toFixed(0)}%`}</text>;
  };
  return (
    <ChartCard title="Sales by Region" subtitle="Geographic revenue distribution" delay={delay}>
      {error ? <ErrState msg={error} /> : (
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <ResponsiveContainer width="60%" height={200} minWidth={140}>
            <PieChart>
              <Pie data={rows} cx="50%" cy="50%" innerRadius={48} outerRadius={80}
                dataKey="revenue" labelLine={false} label={lbl}>
                {rows.map((e,i) => <Cell key={i} fill={e.fill} stroke="transparent"/>)}
              </Pie>
              <Tooltip content={<Tip money />}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex:1, minWidth:100 }}>
            {rows.slice(0,7).map((d,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
                <div style={{ width:9,height:9,borderRadius:2,background:d.fill,flexShrink:0 }}/>
                <span style={{ fontSize:11,color:'var(--text-secondary)',flex:1 }}>{d.region}</span>
                <span style={{ fontSize:11,fontWeight:600,color:'var(--text)' }}>{fmtCurrency(d.revenue,true)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export const OrderStatusChart = ({ delay=0 }) => {
  const { filters } = useFilters();
  const { data, loading, error } = useOrderStatus(filters);
  if (loading) return <ChartSk height={220} />;
  const rows = (data||[]).map(d => ({ ...d, count:parseInt(d.count), fill:STATUS_COLORS[d.status]||'#888' }));
  const total = rows.reduce((s,d) => s+d.count, 0);
  return (
    <ChartCard title="Order Status" subtitle="Distribution by fulfillment status" delay={delay}>
      {error ? <ErrState msg={error} /> : (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {rows.map((d,i) => (
              <div key={i} style={{
                padding:'12px 14px', borderRadius:10,
                background:`${d.fill}12`, border:`1px solid ${d.fill}30`
              }}>
                <div style={{ fontSize:20,fontWeight:700,color:d.fill }}>{fmtNum(d.count,true)}</div>
                <div style={{ fontSize:11,color:'var(--text-muted)',textTransform:'capitalize',marginTop:2 }}>{d.status}</div>
                <div style={{ fontSize:11,fontWeight:600,color:d.fill,marginTop:2 }}>
                  {total>0?((d.count/total)*100).toFixed(1):0}%
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={rows} margin={{top:0,right:0,bottom:0,left:0}} barSize={30}>
              <XAxis dataKey="status" tick={{fill:'var(--text-muted)',fontSize:10}} axisLine={false} tickLine={false}
                tickFormatter={s=>s.charAt(0).toUpperCase()+s.slice(1)}/>
              <Tooltip content={<Tip />}/>
              <Bar dataKey="count" name="Orders" radius={[5,5,0,0]}>
                {rows.map((e,i) => <Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};
