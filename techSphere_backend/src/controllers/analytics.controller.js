import { User } from "../models/user.model.js";
import { Client } from "../models/client.model.js";
import { Service } from "../models/service.model.js";
import { Ticket } from "../models/ticket.model.js";

// Helper function to get date range
const getDateRange = (period) => {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1); // Default to last month
  }

  return { startDate, endDate: now };
};

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Previous period for comparison
    const periodDuration = endDate - startDate;
    const previousStartDate = new Date(startDate - periodDuration);
    const previousEndDate = new Date(startDate);

    // Total Revenue (Calculate from services or a revenue model if you have one)
    const currentServices = await Service.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const previousServices = await Service.countDocuments({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate },
    });

    // Calculate revenue (assuming average service price)
    const services = await Service.find();
    const totalRevenue = services.reduce(
      (sum, service) => sum + (service.price || 0),
      0
    );
    const avgServicePrice =
      services.length > 0 ? totalRevenue / services.length : 0;

    const currentRevenue = currentServices * avgServicePrice;
    const previousRevenue = previousServices * avgServicePrice;
    const revenueChange =
      previousRevenue > 0
        ? (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(1)
        : 0;

    // New Clients
    const currentClients = await Client.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const previousClients = await Client.countDocuments({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate },
    });
    const clientChange =
      previousClients > 0
        ? (
            ((currentClients - previousClients) / previousClients) *
            100
          ).toFixed(1)
        : 0;

    // Active Services (Conversion Rate metric)
    const totalClients = await Client.countDocuments();
    const clientsWithServices = await Client.countDocuments({
      subscriptionStatus: "Active",
    });
    const conversionRate =
      totalClients > 0
        ? ((clientsWithServices / totalClients) * 100).toFixed(1)
        : 0;

    // Churn Rate (Inactive/Suspended clients)
    const inactiveClients = await Client.countDocuments({
      subscriptionStatus: { $in: ["Inactive", "Suspended"] },
    });
    const churnRate =
      totalClients > 0
        ? ((inactiveClients / totalClients) * 100).toFixed(1)
        : 0;

    // Ticket Statistics
    const totalTickets = await Ticket.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const openTickets = await Ticket.countDocuments({
      status: "Open",
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const resolvedTickets = await Ticket.countDocuments({
      status: "Resolved",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          revenue: {
            value: currentRevenue,
            change: revenueChange,
            trend: revenueChange >= 0 ? "up" : "down",
          },
          clients: {
            value: currentClients,
            change: clientChange,
            trend: clientChange >= 0 ? "up" : "down",
          },
          conversionRate: {
            value: conversionRate,
            change: "+5.1", // You can calculate this properly with historical data
            trend: "up",
          },
          churnRate: {
            value: churnRate,
            change: "-1.2", // Lower is better
            trend: "down",
          },
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get revenue trends
// @route   GET /api/analytics/revenue-trends
// @access  Private/Admin
export const getRevenueTrends = async (req, res) => {
  try {
    const { period = "month" } = req.query;

    // Get data for the last 12 months
    const trends = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const servicesCount = await Service.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      const services = await Service.find();
      const avgPrice =
        services.length > 0
          ? services.reduce((sum, s) => sum + (s.price || 0), 0) /
            services.length
          : 0;

      trends.push({
        month: months[date.getMonth()],
        revenue: servicesCount * avgPrice,
      });
    }

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get client acquisition data
// @route   GET /api/analytics/client-acquisition
// @access  Private/Admin
export const getClientAcquisition = async (req, res) => {
  try {
    const data = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await Client.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      data.push({
        month: months[date.getMonth()],
        clients: count,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get subscription distribution
// @route   GET /api/analytics/subscription-distribution
// @access  Private/Admin
export const getSubscriptionDistribution = async (req, res) => {
  try {
    const distribution = await Client.aggregate([
      {
        $group: {
          _id: "$planType",
          count: { $sum: 1 },
        },
      },
    ]);

    const data = distribution.map((item) => ({
      name: item._id || "No Plan",
      value: item.count,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get service performance
// @route   GET /api/analytics/service-performance
// @access  Private/Admin
export const getServicePerformance = async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const data = services.map((item) => ({
      name: item._id || "Other",
      services: item.count,
      revenue: item.totalRevenue,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
