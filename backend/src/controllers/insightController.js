/**
 * Insights Controller
 * Provides advanced financial analytics and recommendations
 */

import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import {
  compareSpending,
  detectOverspendingPatterns,
  generateSavingsRecommendations,
  getSpendingSummary,
  generateFinancialInsights
} from '../utils/insights.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get dashboard insights
 * GET /api/insights/dashboard
 * Returns overall financial health snapshot
 */
export const getDashboardInsights = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Current month spending
  const monthSummary = await getSpendingSummary(userId, monthStart, now);

  // Total balance (all time)
  const allTransactions = await Transaction.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  const totalIncome = allTransactions.find(t => t._id === 'income')?.total || 0;
  const totalExpenses = allTransactions.find(t => t._id === 'expense')?.total || 0;
  const totalBalance = totalIncome - totalExpenses;

  // Recent transactions
  const recentTransactions = await Transaction.find({ userId })
    .sort({ date: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalBalance,
      currentMonthIncome: monthSummary.totalIncome,
      currentMonthExpenses: monthSummary.totalExpense,
      currentMonthSavings: monthSummary.netSavings,
      savingsRate: monthSummary.savingsRate,
      categoryBreakdown: monthSummary.byCategory,
      recentTransactions
    }
  });
});

/**
 * Get spending comparison
 * GET /api/insights/comparison?category=Food
 */
export const getSpendingComparison = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { category = 'Food' } = req.query;

  const now = new Date();
  const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const comparison = await compareSpending(
    userId,
    category,
    thisWeekStart,
    now,
    lastWeekStart,
    lastWeekEnd
  );

  res.json({
    success: true,
    data: {
      category,
      thisWeek: comparison.period1Amount,
      lastWeek: comparison.period2Amount,
      change: comparison.percentageChange,
      message: comparison.spentMore
        ? `You spent ${Math.abs(comparison.percentageChange)}% more on ${category} this week`
        : `You spent ${Math.abs(comparison.percentageChange)}% less on ${category} this week`
    }
  });
});

/**
 * Get overspending patterns
 * GET /api/insights/patterns
 */
export const getOverspendingPatterns = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const patterns = await detectOverspendingPatterns(userId);

  res.json({
    success: true,
    data: patterns,
    totalPatterns: patterns.length
  });
});

/**
 * Get savings recommendations
 * GET /api/insights/recommendations
 */
export const getSavingsRecommendations = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const recommendations = await generateSavingsRecommendations(userId, 10);

  res.json({
    success: true,
    data: recommendations
  });
});

/**
 * Get comprehensive financial insights
 * GET /api/insights/comprehensive
 * Combines all analytics for a complete overview
 */
export const getComprehensiveInsights = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [
    dashboardData,
    patterns,
    recommendations,
    insights
  ] = await Promise.all([
    (async () => {
      const monthSummary = await getSpendingSummary(userId, monthStart, now);
      const allTransactions = await Transaction.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' }
          }
        }
      ]);

      const totalIncome = allTransactions.find(t => t._id === 'income')?.total || 0;
      const totalExpenses = allTransactions.find(t => t._id === 'expense')?.total || 0;

      return {
        totalIncome,
        totalExpenses,
        totalBalance: totalIncome - totalExpenses,
        currentMonthExpenses: monthSummary.totalExpense,
        currentMonthSavings: monthSummary.netSavings
      };
    })(),
    detectOverspendingPatterns(userId),
    generateSavingsRecommendations(userId, 10),
    generateFinancialInsights(userId)
  ]);

  res.json({
    success: true,
    data: {
      overview: dashboardData,
      patterns,
      recommendations,
      insights,
      generatedAt: new Date().toISOString()
    }
  });
});

/**
 * Get spending trends
 * GET /api/insights/trends?months=6
 */
export const getSpendingTrends = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { months = 6 } = req.query;

  const trends = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const summary = await getSpendingSummary(userId, startDate, endDate);
    
    trends.push({
      month: startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: summary.totalIncome,
      expenses: summary.totalExpense,
      savings: summary.netSavings
    });
  }

  res.json({
    success: true,
    data: trends
  });
});
