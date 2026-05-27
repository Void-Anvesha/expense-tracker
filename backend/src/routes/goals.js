/**
 * Goals Routes
 * All routes: POST/GET /api/goals
 */

import express from 'express';
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalProgress
} from '../controllers/goalController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/', createGoal);
router.get('/', getGoals);
router.get('/:id', getGoalById);
router.get('/:id/progress', getGoalProgress);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
