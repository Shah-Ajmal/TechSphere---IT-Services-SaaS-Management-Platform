import express from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  clientValidation,
  idValidation,
  validate,
} from "../utils/validators.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.post("/", isAdmin, clientValidation, validate, createClient);
router.put("/:id", isAdmin, idValidation, validate, updateClient);
router.delete("/:id", isAdmin, idValidation, validate, deleteClient);

// Available to all authenticated users
router.get("/", getAllClients);
router.get("/:id", idValidation, validate, getClientById);

export default router;
