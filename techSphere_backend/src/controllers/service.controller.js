import { Service } from "../models/service.model.js";

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { name, description, price, category, activeStatus, features, icon } =
      req.body;

    const service = await Service.create({
      name,
      description,
      price,
      category,
      activeStatus,
      features,
      icon,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Private
export const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, active } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }
    if (active !== undefined) {
      query.activeStatus = active === "true";
    }

    const services = await Service.find(query)
      .populate("createdBy", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        services,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalServices: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Private
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: { service: updatedService },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
