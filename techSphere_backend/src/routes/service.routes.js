import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  serviceValidation,
  idValidation,
  validate,
} from "../utils/validators.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.post("/", isAdmin, serviceValidation, validate, createService);
router.put("/:id", isAdmin, idValidation, validate, updateService);
router.delete("/:id", isAdmin, idValidation, validate, deleteService);

// Available to all authenticated users
router.get("/", getAllServices);
router.get("/:id", idValidation, validate, getServiceById);

export default router;
