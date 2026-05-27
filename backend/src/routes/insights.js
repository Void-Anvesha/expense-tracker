/**
 * Insights Routes
 * All routes: GET /api/insights
 */

import express from 'express';
import {
  getDashboardInsights,
  getSpendingComparison,
  getOverspendingPatterns,
  getSavingsRecommendations,
  getComprehensiveInsights,
  getSpendingTrends
} from '../controllers/insightController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/dashboard', getDashboardInsights);
router.get('/comparison', getSpendingComparison);
router.get('/patterns', getOverspendingPatterns);
router.get('/recommendations', getSavingsRecommendations);
router.get('/trends', getSpendingTrends);
router.get('/comprehensive', getComprehensiveInsights);

export default router;
