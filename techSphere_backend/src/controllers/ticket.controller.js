import { Ticket } from "../models/ticket.model.js";

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, category } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      userId: req.user._id, // Set by protect middleware
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: { ticket },
    });
  } catch (error) {
    next(error); // Passes to your error.middleware.js
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private (Admin gets all, Users get their own)
export const getAllTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    let query = {};
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const count = await Ticket.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalTickets: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email");

    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    if (
      req.user.role !== "admin" &&
      ticket.userId._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized to access this ticket");
    }

    res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private/Admin
export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
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
    next(error);
  }
};

// @desc    Add note to ticket
// @route   POST /api/tickets/:id/notes
// @access  Private
export const addTicketNote = async (req, res, next) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    if (
      req.user.role !== "admin" &&
      ticket.userId.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized to add notes to this ticket");
    }

    ticket.notes.push({
      message,
      addedBy: req.user._id,
    });

    await ticket.save(); // This triggers the pre-save hook in your model

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate("userId", "name email")
      .populate("notes.addedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: { ticket: updatedTicket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private/Admin
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
