import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      enum: [
        "Cloud Hosting",
        "Security",
        "Monitoring",
        "Database",
        "Analytics",
        "Other",
      ],
      default: "Other",
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    icon: {
      type: String,
      default: "server",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries

serviceSchema.index({ activeStatus: 1 });
serviceSchema.index({ price: 1 });

export const Service = mongoose.model("Service", serviceSchema);
