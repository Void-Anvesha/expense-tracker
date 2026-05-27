/**
 * Transaction Routes
 * All routes: POST/GET /api/transactions
 */

import express from 'express';
import {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
  getCategoryBreakdown
} from '../controllers/transactionController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All transaction routes require authentication
router.use(auth);

// Main endpoints
router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/summary/monthly', getMonthlySummary);
router.get('/breakdown/category', getCategoryBreakdown);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
