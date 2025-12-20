import { Ticket } from "../models/ticket.model.js";

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Client/User)
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: { ticket },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private (Admin gets all, Users get their own)
export const getAllTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    // Build query based on user role
    let query = {};

    // If user is not admin, only show their tickets
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    }

    // Add filters
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Ticket.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalTickets: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Check if user has access to this ticket
    if (
      req.user.role !== "admin" &&
      ticket.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this ticket",
      });
    }

    res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private/Admin
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: { ticket: updatedTicket },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add note to ticket
// @route   POST /api/tickets/:id/notes
// @access  Private
export const addTicketNote = async (req, res) => {
  try {
    const { message } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Check access
    if (
      req.user.role !== "admin" &&
      ticket.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add notes to this ticket",
      });
    }

    ticket.notes.push({
      message,
      addedBy: req.user._id,
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate("userId", "name email")
      .populate("notes.addedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: { ticket: updatedTicket },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private/Admin
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
