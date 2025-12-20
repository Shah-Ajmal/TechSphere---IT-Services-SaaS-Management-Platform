import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  registerValidation,
  loginValidation,
  validate,
} from "../utils/validators.js";

const router = express.Router();

//Public routes

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
