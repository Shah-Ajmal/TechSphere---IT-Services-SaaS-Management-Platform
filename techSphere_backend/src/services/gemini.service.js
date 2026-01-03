// import axios from "axios";

// // Use gemini-1.5-flash (without -latest suffix) or gemini-2.5-flash for newer version
// // const GEMINI_API_URL =
// //   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// // const GEMINI_API_URL =
// //   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
// // System prompt to define chatbot personality and capabilities
// const SYSTEM_CONTEXT = `You are TechSphere's AI Assistant, a helpful virtual support agent for an IT and SaaS platform.

// Your capabilities:
// - Answer questions about account management, services, pricing, and platform features
// - Provide troubleshooting steps for common technical issues
// - Guide users through the platform
// - Help users understand their subscriptions and billing
// - Assist with ticket creation for complex issues

// Your personality:
// - Professional but friendly
// - Clear and concise
// - Helpful and patient
// - Technical but not overwhelming

// Available platform features:
// - Dashboard: Overview of user's services and tickets
// - Services: Browse and purchase IT services (Cloud Hosting, Security, Database, etc.)
// - Subscriptions: Manage active service subscriptions
// - Tickets: Create and track support tickets
// - Settings: Account and profile management

// Pricing tiers:
// - Basic: $49/month - Essential services
// - Pro: $99/month - Advanced features
// - Premium: $199/month - Full suite with priority support
// - Enterprise: Custom pricing - Tailored solutions

// When users need help that requires human intervention, suggest creating a support ticket.
// Keep responses under 200 words unless explaining complex topics.`;

// export const getGeminiResponse = async (message, conversationHistory = []) => {
//   try {
//     // Build conversation context - prepend system context to first user message
//     const contents = [];

//     // Add conversation history
//     conversationHistory.forEach((msg) => {
//       contents.push({
//         role: msg.role === "assistant" ? "model" : "user",
//         parts: [{ text: msg.text }],
//       });
//     });

//     // Add current message with system context if this is the first message
//     if (conversationHistory.length === 0) {
//       contents.push({
//         role: "user",
//         parts: [{ text: `${SYSTEM_CONTEXT}\n\nUser: ${message}` }],
//       });
//     } else {
//       contents.push({
//         role: "user",
//         parts: [{ text: message }],
//       });
//     }

//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents,
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 1024,
//         },
//         safetySettings: [
//           {
//             category: "HARM_CATEGORY_HARASSMENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_HATE_SPEECH",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const botResponse =
//       response.data.candidates[0].content.parts[0].text ||
//       "I apologize, but I couldn't generate a response. Please try again.";

//     return {
//       success: true,
//       response: botResponse,
//     };
//   } catch (error) {
//     console.error("Gemini API Error:", error.response?.data || error.message);

//     // Handle rate limiting
//     if (error.response?.status === 429) {
//       return {
//         success: false,
//         error: "Rate limit exceeded. Please wait a moment before trying again.",
//       };
//     }

//     // Handle other errors
//     return {
//       success: false,
//       error:
//         "I'm having trouble connecting to the server. Please try again later.",
//     };
//   }
// };

// // Analyze if message is requesting ticket creation
// export const shouldCreateTicket = (message) => {
//   const ticketKeywords = [
//     "create ticket",
//     "open ticket",
//     "submit ticket",
//     "need help",
//     "technical issue",
//     "problem with",
//     "not working",
//     "can't access",
//     "error",
//     "broken",
//   ];

//   const lowerMessage = message.toLowerCase();
//   return ticketKeywords.some((keyword) => lowerMessage.includes(keyword));
// };

// // Extract ticket information from conversation
// export const extractTicketInfo = (conversation) => {
//   // Simple extraction - can be enhanced with NLP
//   const lastUserMessage = conversation
//     .filter((msg) => msg.role === "user")
//     .pop();

//   return {
//     title: lastUserMessage?.text.slice(0, 100) || "Support Request",
//     description: lastUserMessage?.text || "User requested assistance",
//     priority: "Medium",
//     category: "General",
//   };
// };

import axios from "axios";

// Updated to use the correct model endpoint - use v1 instead of v1beta
// Option 1: Gemini 1.5 Flash (Fast and efficient)
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

// Option 2: If above doesn't work, try Gemini Pro
// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

// Option 3: If you have access to Gemini 2.0
// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent";

const SYSTEM_CONTEXT = `You are TechSphere's AI Assistant, a helpful virtual support agent for an IT and SaaS platform.

Your capabilities:
- Answer questions about account management, services, pricing, and platform features
- Provide troubleshooting steps for common technical issues
- Guide users through the platform
- Help users understand their subscriptions and billing
- Assist with ticket creation for complex issues
- Analyze user needs and recommend appropriate services

Your personality:
- Professional but friendly
- Clear and concise
- Helpful and patient
- Technical but not overwhelming
- Proactive in identifying user needs

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

// Main chat response function
export const getGeminiResponse = async (message, conversationHistory = []) => {
  try {
    const contents = [];

    conversationHistory.forEach((msg) => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      });
    });

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

    if (error.response?.status === 429) {
      return {
        success: false,
        error: "Rate limit exceeded. Please wait a moment before trying again.",
      };
    }

    return {
      success: false,
      error:
        "I'm having trouble connecting to the server. Please try again later.",
    };
  }
};

// Enhanced intent analysis with AI
export const analyzeIntent = async (message, conversationHistory = []) => {
  try {
    const recentContext = conversationHistory
      .slice(-3)
      .map((m) => `${m.role}: ${m.text}`)
      .join("\n");

    const prompt = `Analyze this user message and conversation context, then return ONLY a valid JSON object (no markdown, no explanation):

Recent conversation:
${recentContext || "No previous context"}

Current message: "${message}"

Return this exact JSON structure:
{
  "intent": "ticket_creation|billing_inquiry|technical_support|account_management|service_recommendation|general_question",
  "urgency": "low|medium|high|critical",
  "sentiment": "positive|neutral|negative|frustrated",
  "category": "General|Billing|Technical|Account|Security|Services",
  "requiresHumanSupport": true or false,
  "suggestedAction": "create_ticket|escalate|provide_info|recommend_service",
  "confidence": 0.0 to 1.0
}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanJson);

    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("Intent analysis error:", error);
    // Return default analysis on error
    return {
      success: false,
      analysis: {
        intent: "general_question",
        urgency: "medium",
        sentiment: "neutral",
        category: "General",
        requiresHumanSupport: false,
        suggestedAction: "provide_info",
        confidence: 0.5,
      },
    };
  }
};

// Analyze user's service needs
export const analyzeServiceNeeds = async (message, userContext = {}) => {
  try {
    const prompt = `Based on this user inquiry and their context, identify which IT/SaaS services they might need:

Available Services:
1. Cloud Hosting - Scalable cloud infrastructure
2. Security Solutions - Firewall, DDoS protection, threat detection
3. Database Management - MySQL, PostgreSQL, MongoDB hosting
4. Backup & Recovery - Automated backups and disaster recovery
5. API Management - API gateway and management tools
6. DevOps Tools - CI/CD pipelines, container orchestration
7. Monitoring & Analytics - Performance monitoring and insights
8. Email Services - Professional email hosting

User inquiry: "${message}"
User's current plan: ${userContext.plan || "Unknown"}
User's current services: ${userContext.services?.join(", ") || "None"}

Return ONLY valid JSON (no markdown):
{
  "recommendations": [
    {
      "service": "service name",
      "reason": "why this service is relevant",
      "priority": "high|medium|low",
      "estimatedMonthlyCost": number
    }
  ],
  "summary": "brief explanation of recommendations"
}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const recommendations = JSON.parse(cleanJson);

    return {
      success: true,
      recommendations,
    };
  } catch (error) {
    console.error("Service analysis error:", error);
    return {
      success: false,
      recommendations: { recommendations: [], summary: "" },
    };
  }
};

// Smart ticket analysis and categorization
export const smartTicketAnalysis = async (title, description) => {
  try {
    const prompt = `Analyze this support ticket and provide structured information:

Title: ${title}
Description: ${description}

Return ONLY valid JSON (no markdown):
{
  "category": "Technical|Billing|Account|Security|General|Services",
  "priority": "Low|Medium|High|Critical",
  "estimatedResolutionTime": number (in hours),
  "requiredExpertise": ["skill1", "skill2"],
  "suggestedAssignee": "Frontend Team|Backend Team|DevOps|Security|Billing|General Support",
  "tags": ["tag1", "tag2"],
  "isCommonIssue": true or false,
  "automatedResponse": "initial helpful response if this is a common issue, or null"
}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanJson);

    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("Ticket analysis error:", error);
    return {
      success: false,
      analysis: {
        category: "General",
        priority: "Medium",
        estimatedResolutionTime: 24,
        requiredExpertise: ["General Support"],
        suggestedAssignee: "General Support",
        tags: [],
        isCommonIssue: false,
        automatedResponse: null,
      },
    };
  }
};

// Generate conversation summary
export const generateConversationSummary = async (conversationHistory) => {
  try {
    const conversation = conversationHistory
      .map((m) => `${m.role}: ${m.text}`)
      .join("\n");

    const prompt = `Summarize this support conversation:

${conversation}

Return ONLY valid JSON (no markdown):
{
  "summary": "brief summary of the conversation",
  "mainTopics": ["topic1", "topic2"],
  "userSentiment": "positive|neutral|negative",
  "issuesResolved": ["resolved issue 1"],
  "issuesUnresolved": ["unresolved issue 1"],
  "recommendedFollowUp": "suggested next steps"
}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const summary = JSON.parse(cleanJson);

    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error("Summary generation error:", error);
    return { success: false, summary: null };
  }
};

// Analyze sentiment in real-time
export const analyzeSentiment = async (message) => {
  try {
    const prompt = `Analyze the sentiment and emotion in this message:

"${message}"

Return ONLY valid JSON (no markdown):
{
  "sentiment": "very_positive|positive|neutral|negative|very_negative",
  "emotion": "happy|frustrated|angry|confused|satisfied|worried",
  "isFrustrated": true or false,
  "needsEscalation": true or false,
  "urgencyScore": 0.0 to 1.0
}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const sentiment = JSON.parse(cleanJson);

    return {
      success: true,
      sentiment,
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return {
      success: false,
      sentiment: {
        sentiment: "neutral",
        emotion: "neutral",
        isFrustrated: false,
        needsEscalation: false,
        urgencyScore: 0.5,
      },
    };
  }
};

// Get automated solution for common issues
export const getAutomatedSolution = async (issueDescription) => {
  try {
    const prompt = `Given this technical issue, provide a solution if it's a common problem:

Issue: "${issueDescription}"

If this is a common, solvable issue, return:
{
  "isSolvable": true,
  "solution": {
    "steps": ["step 1", "step 2", "step 3"],
    "estimatedTime": "X minutes",
    "difficulty": "easy|moderate|advanced",
    "additionalResources": ["link or resource description"]
  },
  "preventionTips": ["tip 1", "tip 2"]
}

If it requires human support, return:
{
  "isSolvable": false,
  "reason": "why human support is needed",
  "recommendedAction": "create_ticket"
}

Return ONLY valid JSON (no markdown).`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1000 },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const solution = JSON.parse(cleanJson);

    return {
      success: true,
      solution,
    };
  } catch (error) {
    console.error("Solution generation error:", error);
    return {
      success: false,
      solution: { isSolvable: false, reason: "Analysis failed" },
    };
  }
};

// Legacy function for backward compatibility
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

// Enhanced ticket info extraction
export const extractTicketInfo = (conversation) => {
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
