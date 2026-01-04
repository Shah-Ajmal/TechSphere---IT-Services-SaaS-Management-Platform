import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import clientRoutes from "./routes/client.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import userRoutes from "./routes/auth.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import chatRoutes from "./routes/chat.routes.js";
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL, // Your Vercel URL
      "https://*.vercel.app", // All Vercel preview deployments
    ],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechSphere API is running",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(
    `🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
});
