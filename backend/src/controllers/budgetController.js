/**
 * Budget Controller
 * Manages category-wise budget limits and tracking
 */

import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create or update a budget
 * POST /api/budgets
 */
export const setBudget = asyncHandler(async (req, res) => {
  const { category, limit, period = 'monthly', alertThreshold = 80 } = req.body;
  const userId = req.userId;

  if (!category || !limit) {
    return res.status(400).json({ success: false, error: 'Category and limit are required' });
  }

  let budget = await Budget.findOneAndUpdate(
    { userId, category, period },
    { limit, alertThreshold },
    { new: true, upsert: true }
  );

  res.status(201).json({
    success: true,
    message: 'Budget set successfully',
    data: budget
  });
});

/**
 * Get all budgets for a user
 * GET /api/budgets
 */
export const getBudgets = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { period = 'monthly' } = req.query;

  const budgets = await Budget.find({ userId, period, isActive: true });

  // Enhance with current spending
  const enhancedBudgets = await Promise.all(
    budgets.map(async (budget) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const spent = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: budget.category,
            type: 'expense',
            date: { $gte: monthStart }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const spentAmount = spent[0]?.total || 0;
      const remaining = budget.limit - spentAmount;
      const percentageUsed = (spentAmount / budget.limit * 100).toFixed(1);

      return {
        ...budget.toObject(),
        spent: spentAmount,
        remaining,
        percentageUsed,
        isExceeded: spentAmount > budget.limit,
        isAlertTriggered: percentageUsed >= budget.alertThreshold
      };
    })
  );

  res.json({
    success: true,
    data: enhancedBudgets
  });
});

/**
 * Get budget for a specific category
 * GET /api/budgets/:category
 */
export const getBudgetByCategory = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { category } = req.params;

  const budget = await Budget.findOne({ userId, category });

  if (!budget) {
    return res.status(404).json({ success: false, error: 'Budget not found' });
  }

  res.json({
    success: true,
    data: budget
  });
});

/**
 * Delete a budget
 * DELETE /api/budgets/:id
 */
export const deleteBudget = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const budget = await Budget.findById(id);

  if (!budget) {
    return res.status(404).json({ success: false, error: 'Budget not found' });
  }

  if (budget.userId.toString() !== userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  await Budget.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Budget deleted successfully'
  });
});

/**
 * Get budget status and alerts
 * GET /api/budgets/status/alerts
 * Returns budgets that have triggered alerts
 */
export const getBudgetAlerts = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const budgets = await Budget.find({ userId, isActive: true });

  const alerts = await Promise.all(
    budgets.map(async (budget) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const spent = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: budget.category,
            type: 'expense',
            date: { $gte: monthStart }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const spentAmount = spent[0]?.total || 0;
      const percentageUsed = (spentAmount / budget.limit * 100).toFixed(1);

      if (percentageUsed >= budget.alertThreshold) {
        return {
          category: budget.category,
          limit: budget.limit,
          spent: spentAmount,
          percentageUsed,
          severity: percentageUsed >= 100 ? 'critical' : percentageUsed >= 90 ? 'high' : 'warning'
        };
      }

      return null;
    })
  );

  const filteredAlerts = alerts.filter(a => a !== null);

  res.json({
    success: true,
    data: filteredAlerts,
    alertCount: filteredAlerts.length
  });
});
