import { Purchase } from "../models/purchase.model.js";
import { Service } from "../models/service.model.js";

// @desc    Purchase a service
// @route   POST /api/purchases
// @access  Private
export const purchaseService = async (req, res) => {
  try {
    const { serviceId, billingCycle = "monthly" } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if user already has this service
    const existingPurchase = await Purchase.findOne({
      userId: req.user._id,
      serviceId,
      status: "Active",
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription for this service",
      });
    }

    // Calculate next billing date
    const nextBillingDate = new Date();
    if (billingCycle === "monthly") {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // Create purchase
    const purchase = await Purchase.create({
      userId: req.user._id,
      serviceId,
      billingCycle,
      price: service.price,
      nextBillingDate,
    });

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate("serviceId", "name description category price icon")
      .populate("userId", "name email");

    res.status(201).json({
      success: true,
      message: "Service purchased successfully",
      data: { purchase: populatedPurchase },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's purchases
// @route   GET /api/purchases
// @access  Private
export const getUserPurchases = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const purchases = await Purchase.find(query)
      .populate("serviceId", "name description category price icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        purchases,
        count: purchases.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all purchases (Admin)
// @route   GET /api/purchases/all
// @access  Private/Admin
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("serviceId", "name description category price")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        purchases,
        count: purchases.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel purchase/subscription
// @route   PUT /api/purchases/:id/cancel
// @access  Private
export const cancelPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check if user owns this purchase
    if (purchase.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this purchase",
      });
    }

    purchase.status = "Cancelled";
    await purchase.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: { purchase },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
