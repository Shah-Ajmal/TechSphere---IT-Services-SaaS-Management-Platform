import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  addTicketNote,
  deleteTicket,
} from "../controllers/ticket.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  ticketValidation,
  idValidation,
  validate,
} from "../utils/validators.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes available to all authenticated users
router.post("/", ticketValidation, validate, createTicket);
router.get("/", getAllTickets);
router.get("/:id", idValidation, validate, getTicketById);
router.post("/:id/notes", idValidation, validate, addTicketNote);

// Admin only routes
router.put("/:id", isAdmin, idValidation, validate, updateTicket);
router.delete("/:id", isAdmin, idValidation, validate, deleteTicket);

export default router;
