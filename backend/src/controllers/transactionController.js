/**
 * Transaction Controller
 * Handles all transaction-related operations
 */

import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { autoCategorizTransaction } from '../utils/categorization.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Add a new transaction
 * POST /api/transactions
 * Auto-categorizes if not provided
 */
export const addTransaction = asyncHandler(async (req, res) => {
  const { amount, category, type, date, notes } = req.body;
  const userId = req.userId; // from auth middleware

  // Validate required fields
  if (!amount || !type) {
    return res.status(400).json({ success: false, error: 'Amount and type are required' });
  }

  // Auto-categorize if not provided
  const finalCategory = category || autoCategorizTransaction(notes);

  const transaction = await Transaction.create({
    userId,
    amount,
    category: finalCategory,
    type,
    date: date || new Date(),
    notes
  });

  res.status(201).json({
    success: true,
    message: 'Transaction added successfully',
    data: transaction
  });
});

/**
 * Get all transactions for a user
 * GET /api/transactions?category=Food&type=expense&startDate=2024-01-01&endDate=2024-12-31
 */
export const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { category, type, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter = { userId };

  if (category) filter.category = category;
  if (type) filter.type = type;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Transaction.countDocuments(filter);

  res.json({
    success: true,
    data: transactions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  });
});

/**
 * Get transaction by ID
 * GET /api/transactions/:id
 */
export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  // Ensure user owns this transaction
  if (transaction.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  res.json({ success: true, data: transaction });
});

/**
 * Update a transaction
 * PUT /api/transactions/:id
 */
export const updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  if (transaction.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  // Update allowed fields
  const { amount, category, type, date, notes } = req.body;
  if (amount !== undefined) transaction.amount = amount;
  if (category) transaction.category = category;
  if (type) transaction.type = type;
  if (date) transaction.date = date;
  if (notes !== undefined) transaction.notes = notes;

  await transaction.save();

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: transaction
  });
});

/**
 * Delete a transaction
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  if (transaction.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  await Transaction.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Transaction deleted successfully'
  });
});

/**
 * Get monthly summary
 * GET /api/transactions/summary/monthly?year=2024&month=1
 */
export const getMonthlySummary = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const summary = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  const income = summary.find(s => s._id === 'income')?.total || 0;
  const expenses = summary.find(s => s._id === 'expense')?.total || 0;

  res.json({
    success: true,
    data: {
      month,
      year,
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses
    }
  });
});

/**
 * Get category-wise breakdown
 * GET /api/transactions/breakdown/category?startDate=2024-01-01&endDate=2024-12-31
 */
export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { startDate, endDate } = req.query;

  const filter = {
    userId: new mongoose.Types.ObjectId(userId),
    type: 'expense'
  };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const breakdown = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);

  res.json({
    success: true,
    data: breakdown
  });
});
