import React, { useState, useCallback, useEffect } from 'react';
import { useFilters } from '../../context/FilterContext';
import { useTransactions } from '../../hooks/useData';
import { transactionsApi } from '../../utils/api';
import { fmtCurrency, fmtDate } from '../../utils/format';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`} style={{ textTransform:'capitalize' }}>{status}</span>
);

const SortIcon = ({ active, dir }) => (
  <span style={{ opacity:active?1:0.3, display:'inline-flex', flexDirection:'column', marginLeft:3 }}>
    <svg width="8" height="5" viewBox="0 0 8 5" fill={active&&dir==='ASC'?'var(--amber)':'var(--text-muted)'}><path d="M4 0L8 5H0L4 0Z"/></svg>
    <svg width="8" height="5" viewBox="0 0 8 5" fill={active&&dir==='DESC'?'var(--amber)':'var(--text-muted)'}><path d="M4 5L0 0H8L4 5Z"/></svg>
  </span>
);

const COLUMNS = [
  { key:'transaction_id',   label:'TXN ID' },
  { key:'customer_name',    label:'Customer' },
  { key:'product_name',     label:'Product' },
  { key:'category',         label:'Category' },
  { key:'region',           label:'Region' },
  { key:'sales_channel',    label:'Channel' },
  { key:'customer_segment', label:'Segment' },
  { key:'payment_method',   label:'Payment' },
  { key:'amount',           label:'Amount' },
  { key:'tax',              label:'Tax' },
  { key:'discount',         label:'Discount' },
  { key:'shipping',         label:'Shipping' },
  { key:'status',           label:'Status' },
  { key:'transaction_date', label:'Date' },
];

const TransactionsTable = ({ refreshKey, onAddClick }) => {
  const { filters } = useFilters();
  const [page, setPage]               = useState(1);
  const [limit]                       = useState(10);
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDeb]     = useState('');
  const [sortBy, setSortBy]           = useState('transaction_date');
  const [sortOrder, setSortOrder]     = useState('DESC');
  const [exporting, setExporting]     = useState(false);
  const [deletingId, setDeletingId]   = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDeb(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [filters, sortBy, sortOrder, refreshKey]);

  const params = { page, limit, sortBy, sortOrder, search: debouncedSearch, ...filters };
  const { data, pagination, loading, error, refetch } = useTransactions(params);

  const handleSort = useCallback((col) => {
    if (sortBy === col) setSortOrder(p => p==='ASC'?'DESC':'ASC');
    else { setSortBy(col); setSortOrder('DESC'); }
  }, [sortBy]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete transaction ${id}?`)) return;
    setDeletingId(id);
    try { await transactionsApi.delete(id); refetch(); }
    catch (err) { alert('Delete failed: ' + err.message); }
    finally { setDeletingId(null); }
  };

  const handleExport = async () => {
    setExporting(true);
    try { await transactionsApi.exportCsv({ search: debouncedSearch, sortBy, sortOrder, ...filters }); }
    catch (err) { alert('Export failed: ' + err.message); }
    finally { setExporting(false); }
  };

  const total      = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;
  const curPage    = pagination?.page || 1;

  const pageNums = () => {
    if (totalPages <= 5) return Array.from({length:totalPages},(_,i)=>i+1);
    if (curPage <= 3) return [1,2,3,4,5];
    if (curPage >= totalPages-2) return [totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
    return [curPage-2,curPage-1,curPage,curPage+1,curPage+2];
  };

  return (
    <div className="card" style={{ overflow:'hidden', marginTop:16 }}>
      {/* Toolbar */}
      <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border-soft)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:10 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--text)' }}>Transactions</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>
              {loading ? 'Loading…' : `${total.toLocaleString('en-IN')} records`}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button onClick={onAddClick} className="btn btn-primary" style={{ fontSize:12, padding:'7px 12px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add
            </button>
            <button onClick={handleExport} disabled={exporting} className="btn btn-ghost" style={{ fontSize:12, padding:'7px 12px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position:'relative', maxWidth:400 }}>
          <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search customer, product, channel…" className="inp"
            style={{ paddingLeft:32, fontSize:13 }} />
          {search && (
            <button onClick={()=>setSearch('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        {loading ? (
          <div style={{ padding:16 }}>
            {Array.from({length:6}).map((_,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'11px 0', borderBottom:'1px solid var(--border-soft)' }}>
                {[80,130,160,90,70,70,80,80,80,60,60,60,70,90].map((w,j) => (
                  <div key={j} className="skeleton" style={{ width:w, height:13, borderRadius:4, flexShrink:0 }} />
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--coral)' }}>⚠ {error}</div>
        ) : data.length === 0 ? (
          <div style={{ padding:48, textAlign:'center' }}>
            <p style={{ fontSize:14, color:'var(--text-muted)' }}>No transactions found</p>
          </div>
        ) : (
          <table className="data-table" style={{ minWidth:1200 }}>
            <thead>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col.key} onClick={()=>handleSort(col.key)}>
                    <div style={{ display:'flex', alignItems:'center' }}>
                      {col.label}<SortIcon active={sortBy===col.key} dir={sortOrder} />
                    </div>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.transaction_id}>
                  <td><span style={{ fontFamily:'monospace', fontSize:11, color:'var(--amber)', fontWeight:600 }}>{row.transaction_id}</span></td>
                  <td style={{ fontWeight:500, whiteSpace:'nowrap' }}>{row.customer_name}</td>
                  <td><span style={{ color:'var(--text-secondary)', display:'block', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.product_name}</span></td>
                  <td><span style={{ background:'var(--bg-muted)', color:'var(--text-secondary)', borderRadius:6, padding:'2px 8px', fontSize:11 }}>{row.category}</span></td>
                  <td style={{ color:'var(--text-secondary)' }}>{row.region}</td>
                  <td>
                    <span style={{ background: row.sales_channel==='Online'?'var(--teal-bg)':row.sales_channel==='Retail'?'var(--amber-bg)':'var(--purple-bg)',
                      color: row.sales_channel==='Online'?'var(--teal)':row.sales_channel==='Retail'?'var(--amber)':'var(--purple)',
                      borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:500 }}>
                      {row.sales_channel||'—'}
                    </span>
                  </td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{row.customer_segment||'—'}</td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{row.payment_method||'—'}</td>
                  <td style={{ fontWeight:600, color:'var(--amber)' }}>{fmtCurrency(row.amount)}</td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{row.tax>0?fmtCurrency(row.tax):'—'}</td>
                  <td style={{ fontSize:12, color:'var(--green)' }}>{row.discount>0?`-${fmtCurrency(row.discount)}`:'—'}</td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{row.shipping>0?fmtCurrency(row.shipping):'—'}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{fmtDate(row.transaction_date)}</td>
                  <td>
                    <button onClick={()=>handleDelete(row.transaction_id)} disabled={deletingId===row.transaction_id}
                      className="btn btn-danger" style={{ fontSize:11, padding:'4px 10px' }}>
                      {deletingId===row.transaction_id?'…':'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && total > 0 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, padding:'12px 18px', borderTop:'1px solid var(--border-soft)' }}>
          <p style={{ fontSize:12, color:'var(--text-muted)' }}>
            {((curPage-1)*limit+1).toLocaleString('en-IN')}–{Math.min(curPage*limit,total).toLocaleString('en-IN')} of {total.toLocaleString('en-IN')}
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:3 }}>
            {[{l:'«',f:()=>setPage(1),d:curPage===1},{l:'‹',f:()=>setPage(p=>Math.max(1,p-1)),d:curPage===1}].map((b,i)=>(
              <button key={i} onClick={b.f} disabled={b.d} className="btn btn-ghost" style={{ padding:'4px 8px', fontSize:12, opacity:b.d?0.35:1 }}>{b.l}</button>
            ))}
            {pageNums().map(p=>(
              <button key={p} onClick={()=>setPage(p)} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${curPage===p?'var(--amber-border)':'transparent'}`, background:curPage===p?'var(--amber-bg)':'transparent', color:curPage===p?'var(--amber)':'var(--text-muted)', fontSize:12, fontWeight:500, cursor:'pointer' }}>{p}</button>
            ))}
            {[{l:'›',f:()=>setPage(p=>Math.min(totalPages,p+1)),d:curPage===totalPages},{l:'»',f:()=>setPage(totalPages),d:curPage===totalPages}].map((b,i)=>(
              <button key={i} onClick={b.f} disabled={b.d} className="btn btn-ghost" style={{ padding:'4px 8px', fontSize:12, opacity:b.d?0.35:1 }}>{b.l}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
