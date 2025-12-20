import { body, param, validationResult } from "express-validator";

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// User registration validation
export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "client", "user"])
    .withMessage("Invalid role"),
];

// User login validation
export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Client validation
export const clientValidation = [
  body("name").trim().notEmpty().withMessage("Client name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("contactNumber")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid contact number"),
  body("planType")
    .optional()
    .isIn(["Basic", "Pro", "Premium", "Enterprise"])
    .withMessage("Invalid plan type"),
  body("subscriptionStatus")
    .optional()
    .isIn(["Active", "Inactive", "Pending", "Suspended"])
    .withMessage("Invalid subscription status"),
];

// Service validation
export const serviceValidation = [
  body("name").trim().notEmpty().withMessage("Service name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category")
    .optional()
    .isIn([
      "Cloud Hosting",
      "Security",
      "Monitoring",
      "Database",
      "Analytics",
      "Other",
    ])
    .withMessage("Invalid category"),
];

// Ticket validation
export const ticketValidation = [
  body("title").trim().notEmpty().withMessage("Ticket title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Invalid priority"),
  body("category")
    .optional()
    .isIn(["Technical", "Billing", "General", "Feature Request", "Bug Report"])
    .withMessage("Invalid category"),
];

// MongoDB ID validation
export const idValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];
