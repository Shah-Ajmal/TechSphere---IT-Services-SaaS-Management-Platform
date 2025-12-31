import axios from "axios";

// Use gemini-1.5-flash (without -latest suffix) or gemini-2.5-flash for newer version
// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
// System prompt to define chatbot personality and capabilities
const SYSTEM_CONTEXT = `You are TechSphere's AI Assistant, a helpful virtual support agent for an IT and SaaS platform.

Your capabilities:
- Answer questions about account management, services, pricing, and platform features
- Provide troubleshooting steps for common technical issues
- Guide users through the platform
- Help users understand their subscriptions and billing
- Assist with ticket creation for complex issues

Your personality:
- Professional but friendly
- Clear and concise
- Helpful and patient
- Technical but not overwhelming

Available platform features:
- Dashboard: Overview of user's services and tickets
- Services: Browse and purchase IT services (Cloud Hosting, Security, Database, etc.)
- Subscriptions: Manage active service subscriptions
- Tickets: Create and track support tickets
- Settings: Account and profile management

Pricing tiers:
- Basic: $49/month - Essential services
- Pro: $99/month - Advanced features
- Premium: $199/month - Full suite with priority support
- Enterprise: Custom pricing - Tailored solutions

When users need help that requires human intervention, suggest creating a support ticket.
Keep responses under 200 words unless explaining complex topics.`;

export const getGeminiResponse = async (message, conversationHistory = []) => {
  try {
    // Build conversation context - prepend system context to first user message
    const contents = [];

    // Add conversation history
    conversationHistory.forEach((msg) => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      });
    });

    // Add current message with system context if this is the first message
    if (conversationHistory.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: `${SYSTEM_CONTEXT}\n\nUser: ${message}` }],
      });
    } else {
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const botResponse =
      response.data.candidates[0].content.parts[0].text ||
      "I apologize, but I couldn't generate a response. Please try again.";

    return {
      success: true,
      response: botResponse,
    };
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);

    // Handle rate limiting
    if (error.response?.status === 429) {
      return {
        success: false,
        error: "Rate limit exceeded. Please wait a moment before trying again.",
      };
    }

    // Handle other errors
    return {
      success: false,
      error:
        "I'm having trouble connecting to the server. Please try again later.",
    };
  }
};

// Analyze if message is requesting ticket creation
export const shouldCreateTicket = (message) => {
  const ticketKeywords = [
    "create ticket",
    "open ticket",
    "submit ticket",
    "need help",
    "technical issue",
    "problem with",
    "not working",
    "can't access",
    "error",
    "broken",
  ];

  const lowerMessage = message.toLowerCase();
  return ticketKeywords.some((keyword) => lowerMessage.includes(keyword));
};

// Extract ticket information from conversation
export const extractTicketInfo = (conversation) => {
  // Simple extraction - can be enhanced with NLP
  const lastUserMessage = conversation
    .filter((msg) => msg.role === "user")
    .pop();

  return {
    title: lastUserMessage?.text.slice(0, 100) || "Support Request",
    description: lastUserMessage?.text || "User requested assistance",
    priority: "Medium",
    category: "General",
  };
};
