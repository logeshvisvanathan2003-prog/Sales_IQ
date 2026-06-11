import { useState, useEffect, useCallback, useRef } from 'react';
import { analyticsApi, transactionsApi } from '../utils/api';

const useAsync = (fn, deps) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const mounted               = useRef(true);

  const run = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fn();
      if (mounted.current) setData(res.data?.data ?? res.data);
    } catch (e) {
      if (mounted.current) setError(e.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    mounted.current = true;
    run();
    return () => { mounted.current = false; };
  }, [run]);

  return { data, loading, error, refetch: run };
};

// Pass full filter object — API layer strips 'all' values
export const useSummary       = (f) => useAsync(() => analyticsApi.getSummary(f),       [JSON.stringify(f)]);
export const useRevenueTrend  = (f, g) => useAsync(() => analyticsApi.getRevenueTrend(f, g), [JSON.stringify(f), g]);
export const useByCategory    = (f) => useAsync(() => analyticsApi.getByCategory(f),    [JSON.stringify(f)]);
export const useByRegion      = (f) => useAsync(() => analyticsApi.getByRegion(f),      [JSON.stringify(f)]);
export const useOrderStatus   = (f) => useAsync(() => analyticsApi.getOrderStatus(f),   [JSON.stringify(f)]);

export const useFilterOptions = () => {
  const [options, setOptions] = useState({
    categories: [], regions: [], statuses: [],
    customerSegments: [], salesChannels: [], paymentMethods: [],
    amountRange: { min: 0, max: 999999 },
  });

  useEffect(() => {
    analyticsApi.getFilterOptions()
      .then(r => setOptions(r.data?.data || options))
      .catch(console.error);
  }, []); // eslint-disable-line

  return { options };
};

export const useTransactions = (params) => {
  const [data, setData]               = useState([]);
  const [pagination, setPagination]   = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const run = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await transactionsApi.getTransactions(params);
      setData(res.data?.data || []);
      setPagination(res.data?.pagination || { total: 0, page: 1, totalPages: 1, limit: 20 });
    } catch (e) {
      setError(e.message); setData([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]); // eslint-disable-line

  useEffect(() => { run(); }, [run]);
  return { data, pagination, loading, error, refetch: run };
};
