/**
 * Goal Controller
 * Manages financial goals and progress tracking
 */

import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create a new financial goal
 * POST /api/goals
 */
export const createGoal = asyncHandler(async (req, res) => {
  const { name, description, category, targetAmount, deadline, priority } = req.body;
  const userId = req.userId;

  if (!name || !targetAmount || !deadline) {
    return res.status(400).json({
      success: false,
      error: 'Name, target amount, and deadline are required'
    });
  }

  const goal = await Goal.create({
    userId,
    name,
    description,
    category,
    targetAmount,
    deadline,
    priority
  });

  res.status(201).json({
    success: true,
    message: 'Goal created successfully',
    data: goal
  });
});

/**
 * Get all goals for a user
 * GET /api/goals?status=active
 */
export const getGoals = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { status = 'active' } = req.query;

  const query = { userId };
  if (status) query.status = status;

  const goals = await Goal.find(query).sort({ deadline: 1 });

  // Add progress percentage
  const goalsWithProgress = goals.map(goal => ({
    ...goal.toObject(),
    progressPercentage: Math.round((goal.currentAmount / goal.targetAmount) * 100),
    daysRemaining: Math.ceil((goal.deadline - new Date()) / (1000 * 60 * 60 * 24))
  }));

  res.json({
    success: true,
    data: goalsWithProgress
  });
});

/**
 * Get goal by ID
 * GET /api/goals/:id
 */
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  if (goal.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  const goalObj = goal.toObject();
  goalObj.progressPercentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  goalObj.daysRemaining = Math.ceil((goal.deadline - new Date()) / (1000 * 60 * 60 * 24));

  res.json({
    success: true,
    data: goalObj
  });
});

/**
 * Update a goal
 * PUT /api/goals/:id
 */
export const updateGoal = asyncHandler(async (req, res) => {
  let goal = await Goal.findById(req.params.id);

  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  if (goal.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  const { name, description, targetAmount, currentAmount, deadline, priority, status } = req.body;

  if (name) goal.name = name;
  if (description) goal.description = description;
  if (targetAmount) goal.targetAmount = targetAmount;
  if (currentAmount !== undefined) goal.currentAmount = currentAmount;
  if (deadline) goal.deadline = deadline;
  if (priority) goal.priority = priority;
  if (status) goal.status = status;

  // Auto-complete goal if target is reached
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'completed';
  }

  await goal.save();

  res.json({
    success: true,
    message: 'Goal updated successfully',
    data: goal
  });
});

/**
 * Delete a goal
 * DELETE /api/goals/:id
 */
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  if (goal.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  await Goal.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Goal deleted successfully'
  });
});

/**
 * Get goal progress and suggestions
 * GET /api/goals/:id/progress
 */
export const getGoalProgress = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  if (goal.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  const progressPercentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const daysRemaining = Math.ceil((goal.deadline - new Date()) / (1000 * 60 * 60 * 24));
  const remaining = goal.targetAmount - goal.currentAmount;
  const requiredPerDay = daysRemaining > 0 ? remaining / daysRemaining : 0;

  let status = 'on-track';
  if (progressPercentage < (100 / 12)) status = 'behind'; // Behind if less than monthly progress
  if (progressPercentage >= 100) status = 'completed';

  res.json({
    success: true,
    data: {
      progressPercentage,
      currentAmount: goal.currentAmount,
      targetAmount: goal.targetAmount,
      remaining,
      daysRemaining,
      requiredPerDay: Math.round(requiredPerDay * 100) / 100,
      status,
      suggestion: status === 'behind'
        ? `You need to save ${Math.round(requiredPerDay * 100) / 100} per day to reach your goal`
        : `Great! You're on track to reach your goal of ${goal.name}`
    }
  });
});
