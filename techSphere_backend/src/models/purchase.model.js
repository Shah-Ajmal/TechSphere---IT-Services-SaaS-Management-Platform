import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Suspended", "Cancelled"],
      default: "Active",
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true, // Add required since it has a default
    },
    nextBillingDate: {
      type: Date, // This should be Date type, NOT enum
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
purchaseSchema.index({ userId: 1 });
purchaseSchema.index({ serviceId: 1 });
purchaseSchema.index({ status: 1 });

export const Purchase = mongoose.model("Purchase", purchaseSchema);
