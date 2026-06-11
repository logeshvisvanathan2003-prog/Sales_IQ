import React from 'react';

export const Sk = ({ w, h = 16 }) => (
  <div className="skeleton" style={{ width: w, height: h, borderRadius: 6 }} />
);

export const MetricSk = () => (
  <div className="card" style={{ padding: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
    </div>
    <div className="skeleton" style={{ width: 100, height: 28, marginBottom: 8 }} />
    <div className="skeleton" style={{ width: 80, height: 12 }} />
  </div>
);

export const ChartSk = ({ height = 220 }) => (
  <div className="card" style={{ padding: 20 }}>
    <div className="skeleton" style={{ width: 160, height: 18, marginBottom: 8 }} />
    <div className="skeleton" style={{ width: 100, height: 12, marginBottom: 20 }} />
    <div className="skeleton" style={{ width: '100%', height: height }} />
  </div>
);
