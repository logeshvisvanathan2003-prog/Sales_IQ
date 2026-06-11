import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

api.interceptors.response.use(
  res => res,
  err => Promise.reject(new Error(err.response?.data?.message || err.message || 'Network Error'))
);

/** Strip 'all' and empty values before sending to API */
const buildParams = (filters = {}) => {
  const params = {};
  const skip = new Set(['all', '', null, undefined]);
  const passthrough = ['startDate','endDate','category','region','status',
    'customerSegment','salesChannel','paymentMethod','minAmount','maxAmount'];
  for (const key of passthrough) {
    if (filters[key] !== undefined && !skip.has(filters[key])) {
      params[key] = filters[key];
    }
  }
  return params;
};

export const analyticsApi = {
  getSummary:      (filters) => api.get('/analytics/summary',      { params: buildParams(filters) }),
  getRevenueTrend: (filters, groupBy = 'month') =>
    api.get('/analytics/revenue-trend', { params: { ...buildParams(filters), groupBy } }),
  getByCategory:   (filters) => api.get('/analytics/by-category',  { params: buildParams(filters) }),
  getByRegion:     (filters) => api.get('/analytics/by-region',    { params: buildParams(filters) }),
  getOrderStatus:  (filters) => api.get('/analytics/order-status', { params: buildParams(filters) }),
  getFilterOptions: ()       => api.get('/analytics/filter-options'),
};

export const transactionsApi = {
  getTransactions: ({ page=1, limit=20, sortBy='transaction_date', sortOrder='DESC',
                      search='', status='all', ...filters }) =>
    api.get('/transactions', {
      params: {
        page, limit, sortBy, sortOrder,
        ...(search ? { search } : {}),
        ...buildParams({ ...filters, status }),
      }
    }),
  create:    (data) => api.post('/transactions', data),
  delete:    (id)   => api.delete(`/transactions/${id}`),
  exportCsv: async (params) => {
    const { search='', status='all', sortBy='transaction_date', sortOrder='DESC', ...filters } = params;
    const response = await api.get('/transactions/export', {
      params: { ...buildParams({ ...filters, status }), search, sortBy, sortOrder },
      responseType: 'blob',
    });
    const url  = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;
