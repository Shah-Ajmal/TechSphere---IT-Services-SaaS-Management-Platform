import express from "express";
import {
  getDashboardAnalytics,
  getRevenueTrends,
  getClientAcquisition,
  getSubscriptionDistribution,
  getServicePerformance,
} from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// All analytics routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Analytics routes
router.get("/dashboard", getDashboardAnalytics);
router.get("/revenue-trends", getRevenueTrends);
router.get("/client-acquisition", getClientAcquisition);
router.get("/subscription-distribution", getSubscriptionDistribution);
router.get("/service-performance", getServicePerformance);

export default router;
