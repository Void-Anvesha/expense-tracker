import mongoose from 'mongoose';

/**
 * Transaction Schema
 * Represents individual transactions (income/expense)
 * - amount: transaction value
 * - category: type of transaction (food, transport, salary, etc)
 * - type: 'income' or 'expense'
 * - date: when the transaction occurred
 * - notes: optional description
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Salary', 'Freelance', 'Shopping', 'Health', 'Education', 'Other'],
      lowercase: true
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
      default: 'expense'
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 500
    },
    tags: [String]
  },
  { timestamps: true }
);

// Index for efficient queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);
