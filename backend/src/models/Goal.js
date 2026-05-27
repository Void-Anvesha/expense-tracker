import mongoose from 'mongoose';

/**
 * Financial Goal Schema
 * Represents savings goals set by users
 * - name: goal name (e.g., "Emergency Fund", "Vacation")
 * - targetAmount: how much to save
 * - currentAmount: current progress
 * - deadline: target date to achieve goal
 * - category: type of goal
 */
const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 500
    },
    category: {
      type: String,
      enum: ['Emergency Fund', 'Vacation', 'Investment', 'Education', 'Home', 'Other'],
      default: 'Other'
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0, 'Target must be positive']
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    deadline: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active'
    }
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Goal', goalSchema);
