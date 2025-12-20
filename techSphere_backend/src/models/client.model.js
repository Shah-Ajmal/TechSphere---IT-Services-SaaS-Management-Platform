import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[0-9]{10,15}$/, "Please provide a valid contact number"],
    },
    planType: {
      type: String,
      enum: ["Basic", "Pro", "Premium", "Enterprise"],
      default: "Basic",
    },
    subscriptionStatus: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Suspended"],
      default: "Active",
    },
    address: {
      type: String,
      trim: true,
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

// Create indexes separately (removed duplicate index definitions)
clientSchema.index({ company: 1 });
clientSchema.index({ subscriptionStatus: 1 });

export const Client = mongoose.model("Client", clientSchema);
