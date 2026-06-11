const { query } = require('../db/connection');

/**
 * Dynamic query builder — supports ALL filter dimensions.
 * Existing callers still work: any unrecognised keys are silently ignored.
 *
 * Supported filters:
 *   startDate, endDate      — date range
 *   category                — product category  (or 'all')
 *   region                  — region            (or 'all')
 *   status                  — order status      (or 'all')
 *   customerSegment         — customer segment  (or 'all')
 *   salesChannel            — sales channel     (or 'all')
 *   paymentMethod           — payment method    (or 'all')
 *   minAmount / maxAmount   — amount range
 */
const buildWhereClause = (filters = {}, tableAlias = 't', startParam = 1) => {
  const conditions = [];
  const params = [];
  let p = startParam;
  const col = (c) => tableAlias ? `${tableAlias}.${c}` : c;

  if (filters.startDate) {
    conditions.push(`${col('transaction_date')} >= $${p++}`);
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push(`${col('transaction_date')} <= $${p++}`);
    params.push(filters.endDate + 'T23:59:59');
  }
  if (filters.category && filters.category !== 'all') {
    conditions.push(`${col('category')} = $${p++}`);
    params.push(filters.category);
  }
  if (filters.region && filters.region !== 'all') {
    conditions.push(`${col('region')} = $${p++}`);
    params.push(filters.region);
  }
  if (filters.status && filters.status !== 'all') {
    conditions.push(`${col('status')} = $${p++}`);
    params.push(filters.status);
  }
  if (filters.customerSegment && filters.customerSegment !== 'all') {
    conditions.push(`${col('customer_segment')} = $${p++}`);
    params.push(filters.customerSegment);
  }
  if (filters.salesChannel && filters.salesChannel !== 'all') {
    conditions.push(`${col('sales_channel')} = $${p++}`);
    params.push(filters.salesChannel);
  }
  if (filters.paymentMethod && filters.paymentMethod !== 'all') {
    conditions.push(`${col('payment_method')} = $${p++}`);
    params.push(filters.paymentMethod);
  }
  if (filters.minAmount && !isNaN(parseFloat(filters.minAmount))) {
    conditions.push(`${col('amount')} >= $${p++}`);
    params.push(parseFloat(filters.minAmount));
  }
  if (filters.maxAmount && !isNaN(parseFloat(filters.maxAmount))) {
    conditions.push(`${col('amount')} <= $${p++}`);
    params.push(parseFloat(filters.maxAmount));
  }
  // search (transactions table only)
  if (filters.search) {
    conditions.push(`(
      ${col('transaction_id')} ILIKE $${p} OR
      ${col('customer_name')}  ILIKE $${p} OR
      ${col('product_name')}   ILIKE $${p} OR
      ${col('category')}       ILIKE $${p} OR
      ${col('region')}         ILIKE $${p}
    )`);
    params.push(`%${filters.search}%`);
    p++;
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
    nextParam: p
  };
};

/** Appends AND status='completed' safely to any existing WHERE clause */
const withCompleted = (whereClause, params) => {
  const clause = whereClause
    ? `${whereClause} AND status = 'completed'`
    : `WHERE status = 'completed'`;
  return { clause, params };
};

// ─────────────────────────────────────────────────────────────
// Extract all supported filter keys from req.query
// ─────────────────────────────────────────────────────────────
const extractFilters = (q) => ({
  startDate:       q.startDate,
  endDate:         q.endDate,
  category:        q.category,
  region:          q.region,
  status:          q.status,
  customerSegment: q.customerSegment,
  salesChannel:    q.salesChannel,
  paymentMethod:   q.paymentMethod,
  minAmount:       q.minAmount,
  maxAmount:       q.maxAmount,
  search:          q.search,
});

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/summary
// ─────────────────────────────────────────────────────────────
const getSummaryMetrics = async (req, res) => {
  try {
    const filters = extractFilters(req.query);
    const { whereClause, params } = buildWhereClause(filters, '');

    const { clause: completedWhere, params: cParams } = withCompleted(whereClause, params);

    const [metrics, topCat, topReg] = await Promise.all([
      query(`
        SELECT
          COUNT(*)                                                        AS total_orders,
          COALESCE(SUM(CASE WHEN status='completed' THEN amount  END), 0) AS total_revenue,
          COALESCE(AVG(CASE WHEN status='completed' THEN amount  END), 0) AS avg_order_value,
          COUNT(DISTINCT customer_name)                                   AS total_customers,
          COALESCE(SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END),0) AS cancelled_orders,
          COALESCE(SUM(CASE WHEN status='pending'   THEN 1 ELSE 0 END),0) AS pending_orders,
          COALESCE(SUM(CASE WHEN status='completed' THEN tax        END), 0) AS total_tax,
          COALESCE(SUM(CASE WHEN status='completed' THEN discount   END), 0) AS total_discount,
          COALESCE(SUM(CASE WHEN status='completed' THEN shipping   END), 0) AS total_shipping
        FROM transactions
        ${whereClause}
      `, params),
      query(`
        SELECT category, SUM(amount) AS revenue
        FROM transactions ${completedWhere}
        GROUP BY category ORDER BY revenue DESC LIMIT 1
      `, cParams),
      query(`
        SELECT region, SUM(amount) AS revenue
        FROM transactions ${completedWhere}
        GROUP BY region ORDER BY revenue DESC LIMIT 1
      `, cParams),
    ]);

    const m = metrics.rows[0];
    res.json({
      success: true,
      data: {
        totalRevenue:    parseFloat(m.total_revenue)    || 0,
        totalOrders:     parseInt(m.total_orders)       || 0,
        avgOrderValue:   parseFloat(m.avg_order_value)  || 0,
        totalCustomers:  parseInt(m.total_customers)    || 0,
        cancelledOrders: parseInt(m.cancelled_orders)   || 0,
        pendingOrders:   parseInt(m.pending_orders)     || 0,
        totalTax:        parseFloat(m.total_tax)        || 0,
        totalDiscount:   parseFloat(m.total_discount)   || 0,
        totalShipping:   parseFloat(m.total_shipping)   || 0,
        topCategory:     topCat.rows[0]?.category       || 'N/A',
        bestRegion:      topReg.rows[0]?.region         || 'N/A',
      }
    });
  } catch (err) {
    console.error('getSummaryMetrics:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch summary metrics', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/revenue-trend
// ─────────────────────────────────────────────────────────────
const getRevenueTrend = async (req, res) => {
  try {
    const { groupBy = 'month', ...rest } = req.query;
    const filters = extractFilters(rest);
    const { whereClause, params } = buildWhereClause(filters, '');
    const { clause: completedWhere } = withCompleted(whereClause, params);

    const dateFmt = groupBy === 'day'
      ? "TO_CHAR(transaction_date,'YYYY-MM-DD')"
      : groupBy === 'week'
      ? "TO_CHAR(DATE_TRUNC('week',transaction_date),'YYYY-MM-DD')"
      : "TO_CHAR(transaction_date,'YYYY-MM')";

    const result = await query(`
      SELECT
        ${dateFmt}      AS period,
        SUM(amount)     AS revenue,
        COUNT(*)        AS orders,
        SUM(tax)        AS tax,
        SUM(discount)   AS discount,
        SUM(shipping)   AS shipping
      FROM transactions
      ${completedWhere}
      GROUP BY period
      ORDER BY period ASC
    `, params);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getRevenueTrend:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch revenue trend', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/by-category
// ─────────────────────────────────────────────────────────────
const getSalesByCategory = async (req, res) => {
  try {
    const filters = extractFilters(req.query);
    const { whereClause, params } = buildWhereClause(filters, '');
    const { clause: completedWhere } = withCompleted(whereClause, params);

    const result = await query(`
      SELECT
        category,
        SUM(amount)             AS revenue,
        SUM(tax)                AS tax,
        SUM(discount)           AS discount,
        SUM(shipping)           AS shipping,
        COUNT(*)                AS orders,
        COUNT(DISTINCT customer_name) AS customers
      FROM transactions
      ${completedWhere}
      GROUP BY category
      ORDER BY revenue DESC
    `, params);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getSalesByCategory:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sales by category', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/by-region
// ─────────────────────────────────────────────────────────────
const getSalesByRegion = async (req, res) => {
  try {
    const filters = extractFilters(req.query);
    const { whereClause, params } = buildWhereClause(filters, '');
    const { clause: completedWhere } = withCompleted(whereClause, params);

    const result = await query(`
      SELECT
        region,
        SUM(amount)             AS revenue,
        SUM(tax)                AS tax,
        SUM(discount)           AS discount,
        SUM(shipping)           AS shipping,
        COUNT(*)                AS orders,
        COUNT(DISTINCT customer_name) AS customers
      FROM transactions
      ${completedWhere}
      GROUP BY region
      ORDER BY revenue DESC
    `, params);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getSalesByRegion:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sales by region', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/order-status
// ─────────────────────────────────────────────────────────────
const getOrderStatus = async (req, res) => {
  try {
    const filters = extractFilters(req.query);
    const { whereClause, params } = buildWhereClause(filters, '');

    const result = await query(`
      SELECT
        status,
        COUNT(*)        AS count,
        SUM(amount)     AS total_amount,
        SUM(tax)        AS total_tax,
        SUM(discount)   AS total_discount,
        SUM(shipping)   AS total_shipping
      FROM transactions
      ${whereClause}
      GROUP BY status
      ORDER BY count DESC
    `, params);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getOrderStatus:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order status', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/filter-options
// Returns all distinct values for every filterable dimension
// ─────────────────────────────────────────────────────────────
const getFilterOptions = async (req, res) => {
  try {
    const [categories, regions, statuses, segments, channels, payments, amountRange] = await Promise.all([
      query(`SELECT DISTINCT category        FROM transactions WHERE category        IS NOT NULL ORDER BY category`),
      query(`SELECT DISTINCT region          FROM transactions WHERE region          IS NOT NULL ORDER BY region`),
      query(`SELECT DISTINCT status          FROM transactions WHERE status          IS NOT NULL ORDER BY status`),
      query(`SELECT DISTINCT customer_segment FROM transactions WHERE customer_segment IS NOT NULL ORDER BY customer_segment`),
      query(`SELECT DISTINCT sales_channel   FROM transactions WHERE sales_channel   IS NOT NULL ORDER BY sales_channel`),
      query(`SELECT DISTINCT payment_method  FROM transactions WHERE payment_method  IS NOT NULL ORDER BY payment_method`),
      query(`SELECT MIN(amount) AS min_amount, MAX(amount) AS max_amount FROM transactions`),
    ]);

    res.json({
      success: true,
      data: {
        categories:       categories.rows.map(r => r.category),
        regions:          regions.rows.map(r => r.region),
        statuses:         statuses.rows.map(r => r.status),
        customerSegments: segments.rows.map(r => r.customer_segment),
        salesChannels:    channels.rows.map(r => r.sales_channel),
        paymentMethods:   payments.rows.map(r => r.payment_method),
        amountRange: {
          min: parseFloat(amountRange.rows[0]?.min_amount) || 0,
          max: parseFloat(amountRange.rows[0]?.max_amount) || 999999,
        },
      }
    });
  } catch (err) {
    console.error('getFilterOptions:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch filter options', error: err.message });
  }
};

module.exports = {
  getSummaryMetrics, getRevenueTrend,
  getSalesByCategory, getSalesByRegion,
  getOrderStatus, getFilterOptions,
};
