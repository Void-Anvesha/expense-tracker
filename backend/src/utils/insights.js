/**
 * Insights & Analytics Generation Engine
 * Generates actionable insights from transaction data
 */

import Transaction from '../models/Transaction.js';

/**
 * Calculate spending comparison between two periods
 * @param {string} userId - User ID
 * @param {string} category - Transaction category
 * @param {Date} startDate1 - Start of period 1
 * @param {Date} endDate1 - End of period 1
 * @param {Date} startDate2 - Start of period 2
 * @param {Date} endDate2 - End of period 2
 */
export const compareSpending = async (userId, category, startDate1, endDate1, startDate2, endDate2) => {
  const period1 = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        category: category,
        type: 'expense',
        date: { $gte: startDate1, $lte: endDate1 }
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const period2 = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        category: category,
        type: 'expense',
        date: { $gte: startDate2, $lte: endDate2 }
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const amount1 = period1[0]?.total || 0;
  const amount2 = period2[0]?.total || 0;
  const percentageChange = amount1 === 0 ? 0 : ((amount2 - amount1) / amount1) * 100;

  return {
    period1Amount: amount1,
    period2Amount: amount2,
    percentageChange: Math.round(percentageChange * 10) / 10,
    spentMore: percentageChange > 0
  };
};

/**
 * Detect overspending patterns
 * Identifies categories where spending is significantly increasing
 * @param {string} userId - User ID
 * @param {number} weeks - Number of weeks to analyze (default: 4)
 */
export const detectOverspendingPatterns = async (userId, weeks = 4) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const mongoose = (await import('mongoose')).default;

  const recentSpending = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: weekAgo, $lte: now }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const previousSpending = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: twoWeeksAgo, $lte: weekAgo }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const patterns = [];

  recentSpending.forEach(recent => {
    const previous = previousSpending.find(p => p._id === recent._id);
    const previousTotal = previous?.total || 0;
    const increase = recent.total - previousTotal;
    const percentageIncrease = previousTotal === 0 ? 100 : (increase / previousTotal) * 100;

    if (percentageIncrease > 25) {
      // Flag if spending increased by more than 25%
      patterns.push({
        category: recent._id,
        currentWeek: recent.total,
        previousWeek: previousTotal,
        increase,
        percentageIncrease: Math.round(percentageIncrease),
        message: `You spent ${percentageIncrease.toFixed(0)}% more on ${recent._id} this week`
      });
    }
  });

  return patterns.sort((a, b) => b.percentageIncrease - a.percentageIncrease);
};

/**
 * Generate savings recommendations
 * Suggests how much the user can save by reducing spending
 * @param {string} userId - User ID
 * @param {number} savingsPercentage - How much to reduce (default: 10%)
 */
export const generateSavingsRecommendations = async (userId, savingsPercentage = 10) => {
  const mongoose = (await import('mongoose')).default;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const monthlySpending = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: thirtyDaysAgo, $lte: now }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgPerTransaction: { $avg: '$amount' }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const recommendations = monthlySpending
    .filter(cat => cat.total > 100) // Only recommend if spending > 100
    .map(cat => ({
      category: cat._id,
      currentSpending: Math.round(cat.total),
      potentialSavings: Math.round((cat.total * savingsPercentage) / 100),
      message: `You can save ${Math.round((cat.total * savingsPercentage) / 100)} per month by reducing ${cat._id} by ${savingsPercentage}%`,
      transactionCount: cat.count,
      avgPerTransaction: Math.round(cat.avgPerTransaction)
    }));

  const totalSavingsPotential = recommendations.reduce((sum, r) => sum + r.potentialSavings, 0);

  return {
    recommendations,
    totalMonthlyPotentialSavings: totalSavingsPotential,
    totalMonthlySpending: Math.round(
      monthlySpending.reduce((sum, cat) => sum + cat.total, 0)
    )
  };
};

/**
 * Get spending summary for a period
 * @param {string} userId - User ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 */
export const getSpendingSummary = async (userId, startDate, endDate) => {
  const mongoose = (await import('mongoose')).default;

  const summary = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $facet: {
        totalIncome: [
          { $match: { type: 'income' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ],
        totalExpense: [
          { $match: { type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ],
        byCategory: [
          { $match: { type: 'expense' } },
          { $group: { _id: '$category', total: { $sum: '$amount' } } },
          { $sort: { total: -1 } }
        ]
      }
    }
  ]);

  const totalIncome = summary[0]?.totalIncome[0]?.total || 0;
  const totalExpense = summary[0]?.totalExpense[0]?.total || 0;

  return {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense,
    savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0,
    byCategory: summary[0]?.byCategory || []
  };
};

/**
 * Generate overall financial insights
 * Combines multiple analytics to provide comprehensive insights
 */
export const generateFinancialInsights = async (userId) => {
  const mongoose = (await import('mongoose')).default;
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const insights = [];

  // 1. Month-over-month comparison
  try {
    const thisMonthSummary = await getSpendingSummary(userId, thisMonthStart, now);
    const lastMonthSummary = await getSpendingSummary(userId, lastMonthStart, lastMonthEnd);

    const expenseChange = ((thisMonthSummary.totalExpense - lastMonthSummary.totalExpense) / lastMonthSummary.totalExpense * 100).toFixed(1);

    if (expenseChange > 0) {
      insights.push({
        type: 'warning',
        title: 'Increased Spending',
        message: `Your expenses have increased by ${expenseChange}% compared to last month`,
        severity: Math.abs(expenseChange) > 20 ? 'high' : 'medium'
      });
    } else {
      insights.push({
        type: 'positive',
        title: 'Reduced Spending',
        message: `Great job! Your expenses have decreased by ${Math.abs(expenseChange)}% compared to last month`,
        severity: 'low'
      });
    }
  } catch (error) {
    console.error('Error comparing months:', error);
  }

  // 2. Overspending patterns
  try {
    const patterns = await detectOverspendingPatterns(userId);
    patterns.slice(0, 2).forEach(pattern => {
      insights.push({
        type: 'warning',
        title: `High ${pattern.category} Spending`,
        message: pattern.message,
        severity: pattern.percentageIncrease > 50 ? 'high' : 'medium'
      });
    });
  } catch (error) {
    console.error('Error detecting patterns:', error);
  }

  // 3. Savings recommendations
  try {
    const recommendations = await generateSavingsRecommendations(userId, 10);
    if (recommendations.totalMonthlyPotentialSavings > 0) {
      insights.push({
        type: 'suggestion',
        title: 'Savings Opportunity',
        message: `You can save ${recommendations.totalMonthlyPotentialSavings} per month by optimizing your spending`,
        severity: 'low'
      });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }

  return insights;
};
