import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Ticket description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    category: {
      type: String,
      enum: [
        "Technical",
        "Billing",
        "General",
        "Feature Request",
        "Bug Report",
      ],
      default: "General",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    notes: [
      {
        message: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
ticketSchema.index({ userId: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ createdAt: -1 });

// Auto-update resolvedAt when status changes to Resolved
ticketSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "Resolved" &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }
  next();
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
