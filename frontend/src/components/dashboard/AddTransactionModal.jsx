import React, { useState } from 'react';
import { transactionsApi } from '../../utils/api';

const CATEGORIES = ['Electronics','Clothing','Home & Garden','Sports','Books','Toys','Beauty','Automotive','Food & Beverages','Office Supplies'];
const REGIONS = ['North','South','East','West','Central','Northeast','Northwest','Southeast','Southwest','Midwest'];
const STATUSES = ['completed','pending','cancelled','refunded'];
const CHANNELS = ['Online','Retail','Partner'];
const SEGMENTS = ['Regular','Premium','VIP','New'];
const PAYMENTS = ['Card','UPI','Net Banking','Cash','Wallet'];

const Field = ({ label, required, error, children, half }) => (
  <div style={{ marginBottom: 14, gridColumn: half ? 'span 1' : undefined }}>
    <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
    {children}
    {error && <p style={{ fontSize: 11, color: 'var(--coral)', marginTop: 3 }}>{error}</p>}
  </div>
);

const AddTransactionModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    customer_name: '', customer_email: '',
    product_name: '', category: '', region: '',
    amount: '', tax: '', discount: '', shipping: '',
    quantity: 1, status: 'completed',
    payment_method: 'Card', sales_channel: 'Online',
    customer_segment: 'Regular',
    transaction_date: new Date().toISOString().slice(0,10),
    notes: '',
  });
  const [errors, setErrors]     = useState({});
  const [submitting, setSub]    = useState(false);
  const [toast, setToast]       = useState(null);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim())  e.customer_name = 'Required';
    if (!form.product_name.trim())   e.product_name  = 'Required';
    if (!form.category)              e.category      = 'Required';
    if (!form.region)                e.region        = 'Required';
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (form.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
      e.customer_email = 'Invalid email';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSub(true);
    try {
      const res = await transactionsApi.create({
        ...form,
        amount:   parseFloat(form.amount),
        tax:      parseFloat(form.tax)      || 0,
        discount: parseFloat(form.discount) || 0,
        shipping: parseFloat(form.shipping) || 0,
        quantity: parseInt(form.quantity)   || 1,
        transaction_date: form.transaction_date
          ? new Date(form.transaction_date).toISOString()
          : undefined,
      });
      setToast({ type: 'success', msg: `${res.data.data.transaction_id} created!` });
      setTimeout(() => { onSuccess && onSuccess(res.data.data); onClose(); }, 1400);
    } catch (err) {
      setToast({ type: 'error', msg: err.message });
      setSub(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px 14px', borderBottom:'1px solid var(--border-soft)' }}>
          <div>
            <h2 style={{ fontSize:17, fontWeight:700, color:'var(--text)' }}>Add Transaction</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Fill in all required fields</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:6, borderRadius:8, color:'var(--text-muted)' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-muted)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {toast && (
          <div style={{ margin:'12px 24px 0', padding:'10px 14px', borderRadius:8, fontSize:13,
            background: toast.type==='success' ? 'var(--teal-bg)' : 'var(--coral-bg)',
            border: `1px solid ${toast.type==='success' ? 'var(--teal-border)' : 'var(--coral-border)'}`,
            color: toast.type==='success' ? 'var(--teal)' : 'var(--coral)' }}>
            {toast.msg}
          </div>
        )}

        <div style={{ padding:'16px 24px', overflowY:'auto', maxHeight:'68vh' }}>
          {/* ── Customer ── */}
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Customer</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            <Field label="Name" required error={errors.customer_name}>
              <input className="inp" placeholder="e.g. Ravi Kumar" value={form.customer_name} onChange={e=>set('customer_name',e.target.value)} />
            </Field>
            <Field label="Email" error={errors.customer_email}>
              <input className="inp" type="email" placeholder="ravi@example.com" value={form.customer_email} onChange={e=>set('customer_email',e.target.value)} />
            </Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            <Field label="Segment">
              <select className="inp" value={form.customer_segment} onChange={e=>set('customer_segment',e.target.value)}>
                {SEGMENTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ height:1, background:'var(--border-soft)', margin:'4px 0 14px' }} />

          {/* ── Product ── */}
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Product & Order</p>
          <Field label="Product Name" required error={errors.product_name}>
            <input className="inp" placeholder="e.g. iPhone 15 Pro" value={form.product_name} onChange={e=>set('product_name',e.target.value)} />
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12 }}>
            <Field label="Category" required error={errors.category}>
              <select className="inp" value={form.category} onChange={e=>set('category',e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Region" required error={errors.region}>
              <select className="inp" value={form.region} onChange={e=>set('region',e.target.value)}>
                <option value="">Select region</option>
                {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Qty">
              <input className="inp" type="number" min="1" value={form.quantity} onChange={e=>set('quantity',e.target.value)} />
            </Field>
          </div>

          <div style={{ height:1, background:'var(--border-soft)', margin:'4px 0 14px' }} />

          {/* ── Financials ── */}
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Financials</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12 }}>
            {[
              { key:'amount',   label:'Amount (₹)',   req:true, err:errors.amount },
              { key:'tax',      label:'Tax (₹)',      req:false },
              { key:'discount', label:'Discount (₹)', req:false },
              { key:'shipping', label:'Shipping (₹)', req:false },
            ].map(({ key, label, req, err }) => (
              <Field key={key} label={label} required={req} error={err}>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:13 }}>₹</span>
                  <input className="inp" type="number" min="0" step="0.01" placeholder="0.00"
                    value={form[key]} onChange={e=>set(key, e.target.value)}
                    style={{ paddingLeft:24 }} />
                </div>
              </Field>
            ))}
          </div>

          <div style={{ height:1, background:'var(--border-soft)', margin:'4px 0 14px' }} />

          {/* ── Channel & Payment ── */}
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Channel & Payment</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12 }}>
            <Field label="Sales Channel">
              <select className="inp" value={form.sales_channel} onChange={e=>set('sales_channel',e.target.value)}>
                {CHANNELS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Payment Method">
              <select className="inp" value={form.payment_method} onChange={e=>set('payment_method',e.target.value)}>
                {PAYMENTS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="inp" value={form.status} onChange={e=>set('status',e.target.value)}>
                {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input className="inp" type="date" value={form.transaction_date}
                onChange={e=>set('transaction_date',e.target.value)} style={{ colorScheme:'light' }} />
            </Field>
          </div>

          <Field label="Notes">
            <textarea className="inp" rows={2} placeholder="Optional notes..." value={form.notes}
              onChange={e=>set('notes',e.target.value)} style={{ resize:'vertical', minHeight:56 }} />
          </Field>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'12px 24px 18px', borderTop:'1px solid var(--border-soft)' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={submitting}>
            {submitting
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:'spin 0.7s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Saving...</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Save Transaction</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
