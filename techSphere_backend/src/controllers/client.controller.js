import { Client } from "../models/client.model.js";

// @desc    Create new client
// @route   POST /api/clients
// @access  Private/Admin
export const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      contactNumber,
      planType,
      subscriptionStatus,
      address,
    } = req.body;

    const client = await Client.create({
      name,
      email,
      company,
      contactNumber,
      planType,
      subscriptionStatus,
      address,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: { client },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.subscriptionStatus = status;
    }

    const clients = await Client.find(query)
      .populate("createdBy", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        clients,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalClients: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { client },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private/Admin
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: { client: updatedClient },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await Client.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
