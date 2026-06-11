const { query } = require('../db/connection');

/**
 * Dynamic WHERE clause builder — same filter dimensions as analytics.
 * All filters are optional and work in combination (AND logic).
 */
const buildWhereClause = (filters = {}, startParam = 1) => {
  const conditions = [];
  const params = [];
  let p = startParam;

  if (filters.startDate) {
    conditions.push(`t.transaction_date >= $${p++}`);
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push(`t.transaction_date <= $${p++}`);
    params.push(filters.endDate + 'T23:59:59');
  }
  if (filters.category && filters.category !== 'all') {
    conditions.push(`t.category = $${p++}`);
    params.push(filters.category);
  }
  if (filters.region && filters.region !== 'all') {
    conditions.push(`t.region = $${p++}`);
    params.push(filters.region);
  }
  if (filters.status && filters.status !== 'all') {
    conditions.push(`t.status = $${p++}`);
    params.push(filters.status);
  }
  if (filters.customerSegment && filters.customerSegment !== 'all') {
    conditions.push(`t.customer_segment = $${p++}`);
    params.push(filters.customerSegment);
  }
  if (filters.salesChannel && filters.salesChannel !== 'all') {
    conditions.push(`t.sales_channel = $${p++}`);
    params.push(filters.salesChannel);
  }
  if (filters.paymentMethod && filters.paymentMethod !== 'all') {
    conditions.push(`t.payment_method = $${p++}`);
    params.push(filters.paymentMethod);
  }
  if (filters.minAmount && !isNaN(parseFloat(filters.minAmount))) {
    conditions.push(`t.amount >= $${p++}`);
    params.push(parseFloat(filters.minAmount));
  }
  if (filters.maxAmount && !isNaN(parseFloat(filters.maxAmount))) {
    conditions.push(`t.amount <= $${p++}`);
    params.push(parseFloat(filters.maxAmount));
  }
  if (filters.search) {
    conditions.push(`(
      t.transaction_id    ILIKE $${p} OR
      t.customer_name     ILIKE $${p} OR
      t.product_name      ILIKE $${p} OR
      t.category          ILIKE $${p} OR
      t.region            ILIKE $${p} OR
      t.payment_method    ILIKE $${p} OR
      t.sales_channel     ILIKE $${p}
    )`);
    params.push(`%${filters.search}%`);
    p++;
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
    nextParam: p,
  };
};

const VALID_SORT_COLUMNS = {
  transaction_id:   't.transaction_id',
  customer_name:    't.customer_name',
  product_name:     't.product_name',
  category:         't.category',
  region:           't.region',
  amount:           't.amount',
  tax:              't.tax',
  discount:         't.discount',
  shipping:         't.shipping',
  status:           't.status',
  payment_method:   't.payment_method',
  sales_channel:    't.sales_channel',
  customer_segment: 't.customer_segment',
  transaction_date: 't.transaction_date',
};

// ─────────────────────────────────────────────────────────────
// GET /api/transactions
// ─────────────────────────────────────────────────────────────
const getTransactions = async (req, res) => {
  try {
    const {
      page = 1, limit = 20,
      sortBy = 'transaction_date', sortOrder = 'DESC',
      search = '', status = 'all',
      startDate, endDate, category, region,
      customerSegment, salesChannel, paymentMethod,
      minAmount, maxAmount,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset   = (pageNum - 1) * limitNum;
    const sortCol  = VALID_SORT_COLUMNS[sortBy] || 't.transaction_date';
    const order    = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { whereClause, params, nextParam } = buildWhereClause({
      startDate, endDate, category, region, search, status,
      customerSegment, salesChannel, paymentMethod,
      minAmount, maxAmount,
    });

    const [countResult, dataResult] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM transactions t ${whereClause}`, params),
      query(`
        SELECT
          t.transaction_id,
          t.customer_name,
          t.product_name,
          t.category,
          t.region,
          t.amount,
          t.tax,
          t.discount,
          t.shipping,
          t.status,
          t.payment_method,
          t.sales_channel,
          t.customer_segment,
          t.quantity,
          t.notes,
          t.transaction_date
        FROM transactions t
        ${whereClause}
        ORDER BY ${sortCol} ${order}
        LIMIT $${nextParam} OFFSET $${nextParam + 1}
      `, [...params, limitNum, offset]),
    ]);

    const total = parseInt(countResult.rows[0].total);
    res.json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    console.error('getTransactions:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/transactions
// ─────────────────────────────────────────────────────────────
const createTransaction = async (req, res) => {
  try {
    const {
      customer_name, customer_email = null,
      product_name, category, region,
      amount, quantity = 1,
      tax = 0, discount = 0, shipping = 0,
      status = 'completed',
      payment_method = 'Card',
      sales_channel = 'Online',
      customer_segment = 'Regular',
      notes = null,
      transaction_date = new Date().toISOString(),
    } = req.body;

    if (!customer_name || !product_name || !category || !region || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields: customer_name, product_name, category, region, amount' });
    }

    const ts    = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const rand  = Math.floor(Math.random() * 90000) + 10000;
    const txnId = `TXN-${ts}-${rand}`;

    const result = await query(`
      INSERT INTO transactions (
        transaction_id, customer_name, customer_email, product_name,
        category, region, amount, tax, discount, shipping,
        quantity, status, payment_method, sales_channel,
        customer_segment, notes, transaction_date
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *
    `, [
      txnId, customer_name.trim(), customer_email, product_name.trim(),
      category, region,
      parseFloat(amount), parseFloat(tax) || 0,
      parseFloat(discount) || 0, parseFloat(shipping) || 0,
      parseInt(quantity) || 1, status, payment_method,
      sales_channel, customer_segment, notes, transaction_date,
    ]);

    res.status(201).json({ success: true, data: result.rows[0], message: 'Transaction created successfully' });
  } catch (err) {
    console.error('createTransaction:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/transactions/:id
// ─────────────────────────────────────────────────────────────
const deleteTransaction = async (req, res) => {
  try {
    const result = await query(
      `DELETE FROM transactions WHERE transaction_id = $1 RETURNING transaction_id`,
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, message: `Transaction ${result.rows[0].transaction_id} deleted` });
  } catch (err) {
    console.error('deleteTransaction:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/transactions/export
// ─────────────────────────────────────────────────────────────
const exportTransactionsCsv = async (req, res) => {
  try {
    const {
      search = '', status = 'all', startDate, endDate,
      category, region, customerSegment, salesChannel,
      paymentMethod, minAmount, maxAmount,
      sortBy = 'transaction_date', sortOrder = 'DESC',
    } = req.query;

    const sortCol = VALID_SORT_COLUMNS[sortBy] || 't.transaction_date';
    const order   = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const { whereClause, params } = buildWhereClause({
      startDate, endDate, category, region, search, status,
      customerSegment, salesChannel, paymentMethod,
      minAmount, maxAmount,
    });

    const result = await query(`
      SELECT
        t.transaction_id   AS "Transaction ID",
        t.customer_name    AS "Customer",
        t.customer_segment AS "Segment",
        t.product_name     AS "Product",
        t.category         AS "Category",
        t.region           AS "Region",
        t.sales_channel    AS "Channel",
        t.payment_method   AS "Payment Method",
        t.amount           AS "Amount",
        t.tax              AS "Tax",
        t.discount         AS "Discount",
        t.shipping         AS "Shipping",
        t.status           AS "Status",
        TO_CHAR(t.transaction_date,'YYYY-MM-DD') AS "Date"
      FROM transactions t ${whereClause}
      ORDER BY ${sortCol} ${order}
    `, params);

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'No data to export' });

    const headers  = Object.keys(result.rows[0]);
    const csvLines = [headers.map(h => `"${h}"`).join(',')];
    for (const row of result.rows) {
      csvLines.push(headers.map(h => {
        const v = row[h];
        return v == null ? '' : `"${String(v).replace(/"/g, '""')}"`;
      }).join(','));
    }

    const csv = csvLines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));
    res.send(csv);
  } catch (err) {
    console.error('exportTransactionsCsv:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTransactions, deleteTransaction, createTransaction, exportTransactionsCsv };
