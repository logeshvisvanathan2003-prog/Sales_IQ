import React from 'react';

export const MetricSk = () => (
  <div className="card" style={{ padding: 22 }}>
    <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 12, marginBottom: 16 }} />
    <div className="skeleton" style={{ width: 110, height: 26, marginBottom: 8, borderRadius: 6 }} />
    <div className="skeleton" style={{ width: 80, height: 11, borderRadius: 4 }} />
  </div>
);

export const ChartSk = ({ height = 220 }) => (
  <div className="card" style={{ padding: 22 }}>
    <div className="skeleton" style={{ width: 160, height: 16, marginBottom: 8, borderRadius: 6 }} />
    <div className="skeleton" style={{ width: 100, height: 11, marginBottom: 22, borderRadius: 4 }} />
    <div className="skeleton" style={{ width: '100%', height, borderRadius: 10 }} />
  </div>
);
