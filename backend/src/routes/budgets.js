/**
 * Budget Routes
 * All routes: POST/GET /api/budgets
 */

import express from 'express';
import {
  setBudget,
  getBudgets,
  getBudgetByCategory,
  deleteBudget,
  getBudgetAlerts
} from '../controllers/budgetController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/', setBudget);
router.get('/', getBudgets);
router.get('/alerts/status', getBudgetAlerts);
router.get('/:category', getBudgetByCategory);
router.delete('/:id', deleteBudget);

export default router;
