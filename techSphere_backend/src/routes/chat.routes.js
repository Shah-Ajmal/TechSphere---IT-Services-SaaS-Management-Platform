import express from "express";
import {
  sendMessage,
  createTicketFromChat,
  getFAQs,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/faqs", getFAQs);

// Protected routes
router.post("/message", protect, sendMessage);
router.post("/create-ticket", protect, createTicketFromChat);

export default router;
