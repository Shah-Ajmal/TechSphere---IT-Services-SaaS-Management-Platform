import express from "express";
import {
  purchaseService,
  getUserPurchases,
  getAllPurchases,
  cancelPurchase,
} from "../controllers/purchase.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post("/", purchaseService);
router.get("/", getUserPurchases);
router.put("/:id/cancel", cancelPurchase);

// Admin routes
router.get("/all", isAdmin, getAllPurchases);

export default router;
