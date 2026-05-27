import mongoose from 'mongoose';

/**
 * Budget Schema
 * Represents category-wise budget limits
 * - category: which category has a budget
 * - limit: maximum allowed spending per month
 * - period: 'monthly' or other period types
 * - alertThreshold: percentage (80 = 80%) to trigger alerts
 */
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Education', 'Other'],
      lowercase: true
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Limit must be positive']
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly', 'yearly'],
      default: 'monthly'
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert when 80% of budget is spent
      min: 1,
      max: 100
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Ensure one budget per category per user per period
budgetSchema.index({ userId: 1, category: 1, period: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
