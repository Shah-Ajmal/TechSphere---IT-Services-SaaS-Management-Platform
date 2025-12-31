import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  getAllUsers,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  registerValidation,
  loginValidation,
  validate,
} from "../utils/validators.js";
import { body } from "express-validator";

const router = express.Router();

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/", protect, isAdmin, getAllUsers);

// Change password
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    validate,
  ],
  changePassword
);

// Update notifications
router.put("/notifications", protect, updateNotifications);

// Delete account
router.delete(
  "/account",
  protect,
  [
    body("password")
      .notEmpty()
      .withMessage("Password is required to delete account"),
    validate,
  ],
  deleteAccount
);

export default router;
