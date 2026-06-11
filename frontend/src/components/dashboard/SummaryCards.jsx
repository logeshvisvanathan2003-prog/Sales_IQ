import React, { useEffect, useRef, useState } from 'react';
import { useSummary } from '../../hooks/useData';
import { useFilters } from '../../context/FilterContext';
import { fmtCurrency, fmtNum } from '../../utils/format';
import { MetricSk } from '../ui/Skeleton';

const CountUp = ({ target, fmt }) => {
  const [v, setV] = useState(0);
  const ref = useRef();
  useEffect(() => {
    if (!target) { setV(0); return; }
    const dur = 900, start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now()-start)/dur, 1);
      setV(target * (1 - Math.pow(1-t, 3)));
      if (t < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target]);
  return <span>{fmt(v)}</span>;
};

const Card = ({ icon, label, value, fmt, accent, bg, delay, sub }) => (
  <div className="card" style={{ padding:20, animationDelay:`${delay}ms`, animation:'fadeUp 0.4s ease both', cursor:'default', transition:'transform 0.2s,box-shadow 0.2s' }}
    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
    onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
    <div style={{ width:40,height:40,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:accent,marginBottom:14 }}>
      {icon}
    </div>
    <div style={{ fontSize:24,fontWeight:700,color:'var(--text)',marginBottom:4,letterSpacing:'-0.5px' }}>
      <CountUp target={value} fmt={fmt} />
    </div>
    <div style={{ fontSize:11,color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em' }}>{label}</div>
    {sub && <div style={{ fontSize:11,color:accent,marginTop:4,fontWeight:500 }}>{sub}</div>}
  </div>
);

const InfoCard = ({ icon, label, value, accent, bg, delay }) => (
  <div className="card" style={{ padding:20, animationDelay:`${delay}ms`, animation:'fadeUp 0.4s ease both' }}>
    <div style={{ width:40,height:40,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:accent,marginBottom:14 }}>{icon}</div>
    <div style={{ fontSize:16,fontWeight:700,color:'var(--text)',marginBottom:4 }}>{value||'—'}</div>
    <div style={{ fontSize:11,color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em' }}>{label}</div>
  </div>
);

const ICONS = {
  revenue:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  orders:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  avg:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  customers:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  tax:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
  discount: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  shipping: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  category: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  region:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

const ErrCard = ({ message }) => (
  <div className="card" style={{ padding:16, gridColumn:'1/-1', display:'flex', gap:10, alignItems:'center', background:'var(--coral-bg)', borderColor:'var(--coral-border)' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span style={{ fontSize:13, color:'var(--coral)' }}>{message}</span>
  </div>
);

const SummaryCards = () => {
  const { filters } = useFilters();
  const { data, loading, error } = useSummary(filters);

  if (loading) return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:20 }}>
      {Array.from({length:8}).map((_,i) => <MetricSk key={i} />)}
    </div>
  );
  if (error) return <div style={{ marginBottom:20 }}><ErrCard message={`Failed to load summary: ${error}`} /></div>;

  return (
    <div style={{ marginBottom:20 }}>
      {/* Row 1 — Core metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:14 }}>
        <Card icon={ICONS.revenue}   label="Total Revenue"    value={data?.totalRevenue||0}   fmt={v=>fmtCurrency(v,true)}        accent="var(--amber)"  bg="var(--amber-bg)"  delay={0} />
        <Card icon={ICONS.orders}    label="Total Orders"     value={data?.totalOrders||0}    fmt={v=>fmtNum(Math.round(v),true)} accent="var(--teal)"   bg="var(--teal-bg)"   delay={60} />
        <Card icon={ICONS.avg}       label="Avg Order Value"  value={data?.avgOrderValue||0}  fmt={v=>fmtCurrency(v,true)}        accent="var(--purple)" bg="var(--purple-bg)" delay={120} />
        <Card icon={ICONS.customers} label="Customers"        value={data?.totalCustomers||0} fmt={v=>fmtNum(Math.round(v),true)} accent="var(--coral)"  bg="var(--coral-bg)"  delay={180} />
      </div>
      {/* Row 2 — Financial breakdown + info */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
        <Card icon={ICONS.tax}      label="Total Tax"         value={data?.totalTax||0}      fmt={v=>fmtCurrency(v,true)} accent="var(--purple)" bg="var(--purple-bg)" delay={240} />
        <Card icon={ICONS.discount} label="Total Discounts"   value={data?.totalDiscount||0} fmt={v=>fmtCurrency(v,true)} accent="var(--green)"  bg="var(--green-bg)"  delay={300} />
        <Card icon={ICONS.shipping} label="Total Shipping"    value={data?.totalShipping||0} fmt={v=>fmtCurrency(v,true)} accent="var(--teal)"   bg="var(--teal-bg)"   delay={360} />
        <InfoCard icon={ICONS.category} label="Top Category"  value={data?.topCategory}  accent="var(--amber)" bg="var(--amber-bg)" delay={420} />
        <InfoCard icon={ICONS.region}   label="Best Region"   value={data?.bestRegion}   accent="var(--teal)"  bg="var(--teal-bg)"  delay={480} />
      </div>
    </div>
  );
};

export default SummaryCards;
