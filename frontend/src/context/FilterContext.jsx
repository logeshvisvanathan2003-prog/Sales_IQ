import React, { createContext, useContext, useState, useCallback } from 'react';

const ONE_YEAR_AGO = new Date();
ONE_YEAR_AGO.setFullYear(ONE_YEAR_AGO.getFullYear() - 1);
const fmt = (d) => d.toISOString().slice(0, 10);

const DEFAULT_FILTERS = {
  startDate:       fmt(ONE_YEAR_AGO),
  endDate:         fmt(new Date()),
  category:        'all',
  region:          'all',
  status:          'all',
  customerSegment: 'all',
  salesChannel:    'all',
  paymentMethod:   'all',
  minAmount:       '',
  maxAmount:       '',
};

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const update = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasActive = Object.entries(filters).some(([k, v]) => {
    const def = DEFAULT_FILTERS[k];
    return v !== def && v !== '' && v !== 'all';
  });

  return (
    <FilterContext.Provider value={{ filters, update, reset, hasActive }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be inside FilterProvider');
  return ctx;
};
