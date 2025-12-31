import axiosInstance from "@/lib/axios";

// Send message to chatbot
export const sendChatMessage = async (message, conversationHistory = []) => {
  const response = await axiosInstance.post("/chat/message", {
    message,
    conversationHistory,
  });
  return response.data;
};

// Create ticket from chat
export const createTicketFromChat = async (
  title,
  description,
  conversationHistory
) => {
  const response = await axiosInstance.post("/chat/create-ticket", {
    title,
    description,
    conversationHistory,
  });
  return response.data;
};

// Get FAQs
export const getFAQs = async () => {
  const response = await axiosInstance.get("/chat/faqs");
  return response.data;
};
