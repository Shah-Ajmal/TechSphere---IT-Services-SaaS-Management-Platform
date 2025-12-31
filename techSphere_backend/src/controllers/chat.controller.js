import {
  getGeminiResponse,
  shouldCreateTicket,
  extractTicketInfo,
} from "../services/gemini.service.js";
import { Ticket } from "../models/ticket.model.js";

// @desc    Send message to AI chatbot
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get response from Gemini
    const result = await getGeminiResponse(message, conversationHistory);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    // Check if user is requesting ticket creation
    const needsTicket = shouldCreateTicket(message);

    res.status(200).json({
      success: true,
      data: {
        response: result.response,
        suggestTicket: needsTicket,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

// @desc    Create ticket from chat
// @route   POST /api/chat/create-ticket
// @access  Private
export const createTicketFromChat = async (req, res) => {
  try {
    const { title, description, conversationHistory = [] } = req.body;

    // If no title/description provided, extract from conversation
    let ticketData;
    if (!title || !description) {
      ticketData = extractTicketInfo(conversationHistory);
    } else {
      ticketData = {
        title,
        description,
        priority: "Medium",
        category: "General",
      };
    }

    // Create ticket
    const ticket = await Ticket.create({
      ...ticketData,
      userId: req.user._id,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("userId", "name email")
      .populate("assignedTo", "name email");

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      data: { ticket: populatedTicket },
    });
  } catch (error) {
    console.error("Ticket creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};

// @desc    Get FAQ suggestions
// @route   GET /api/chat/faqs
// @access  Public
export const getFAQs = async (req, res) => {
  try {
    const faqs = [
      {
        id: 1,
        question: "How do I reset my password?",
        answer:
          "Go to Settings → Security → Change Password. You'll need your current password to set a new one.",
        category: "Account",
      },
      {
        id: 2,
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
        category: "Billing",
      },
      {
        id: 3,
        question: "How do I upgrade my subscription?",
        answer:
          "Visit the Services page, select a higher tier plan, and click 'Upgrade'. You'll only pay the prorated difference.",
        category: "Subscriptions",
      },
      {
        id: 4,
        question: "How do I create a support ticket?",
        answer:
          "Go to the Tickets page and click 'New Ticket'. Fill in the details and submit. You can also ask me to create one for you!",
        category: "Support",
      },
      {
        id: 5,
        question: "What's included in the Premium plan?",
        answer:
          "Premium includes all Pro features plus priority support, advanced analytics, dedicated account manager, and custom integrations.",
        category: "Plans",
      },
    ];

    res.status(200).json({
      success: true,
      data: { faqs },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
    });
  }
};
