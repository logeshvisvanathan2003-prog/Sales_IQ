const express = require('express');
const router = express.Router();
const {
  getSummaryMetrics,
  getRevenueTrend,
  getSalesByCategory,
  getSalesByRegion,
  getOrderStatus,
  getFilterOptions
} = require('../controllers/analyticsController');

/**
 * @route   GET /api/analytics/summary
 * @desc    Get summary metrics (revenue, orders, customers, etc.)
 * @query   startDate, endDate, category, region
 */
router.get('/summary', getSummaryMetrics);

/**
 * @route   GET /api/analytics/revenue-trend
 * @desc    Get revenue trend over time
 * @query   startDate, endDate, category, region, groupBy (day|week|month)
 */
router.get('/revenue-trend', getRevenueTrend);

/**
 * @route   GET /api/analytics/by-category
 * @desc    Get sales breakdown by category
 * @query   startDate, endDate, region
 */
router.get('/by-category', getSalesByCategory);

/**
 * @route   GET /api/analytics/by-region
 * @desc    Get sales breakdown by region
 * @query   startDate, endDate, category
 */
router.get('/by-region', getSalesByRegion);

/**
 * @route   GET /api/analytics/order-status
 * @desc    Get order status distribution
 * @query   startDate, endDate, category, region
 */
router.get('/order-status', getOrderStatus);

/**
 * @route   GET /api/analytics/filter-options
 * @desc    Get all available filter options (categories and regions)
 */
router.get('/filter-options', getFilterOptions);

module.exports = router;
