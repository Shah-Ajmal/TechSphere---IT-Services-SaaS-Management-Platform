import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Minimize2,
  Ticket as TicketIcon,
} from "lucide-react";
import {
  sendChatMessage,
  createTicketFromChat,
  getFAQs,
} from "@/services/chatService";
import { useAppSelector } from "@/redux/hooks";

const FloatingChatWidget = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hi ${
        user?.name || "there"
      }! 👋 I'm TechSphere's AI Assistant. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketPrompt, setShowTicketPrompt] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [showFAQs, setShowFAQs] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch FAQs on mount
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await getFAQs();
        if (response.success) {
          setFaqs(response.data.faqs.slice(0, 3)); // Show top 3
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      }
    };
    loadFAQs();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowFAQs(false);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text,
      }));

      const response = await sendChatMessage(inputMessage, conversationHistory);

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          role: "assistant",
          text: response.data.response,
          timestamp: new Date(),
          suggestTicket: response.data.suggestTicket,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Show ticket creation prompt if suggested
        if (response.data.suggestTicket) {
          setShowTicketPrompt(true);
        }
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text,
      }));

      const response = await createTicketFromChat(
        null,
        null,
        conversationHistory
      );

      if (response.success) {
        const confirmMessage = {
          id: Date.now(),
          role: "assistant",
          text: `✅ Great! I've created support ticket #${response.data.ticket._id.slice(
            -6
          )} for you. Our team will review it and get back to you soon. You can track it in the Tickets page.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
        setShowTicketPrompt(false);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        role: "assistant",
        text: "Sorry, I couldn't create the ticket. Please try creating one manually from the Tickets page.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleFAQClick = (faq) => {
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: faq.question,
      timestamp: new Date(),
    };

    const botMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: faq.answer,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setShowFAQs(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            {/* Ticket Creation Prompt */}
            {showTicketPrompt && !isLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm mb-2">
                  Would you like me to create a support ticket for this issue?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateTicket}>
                    <TicketIcon className="h-4 w-4 mr-1" />
                    Yes, Create Ticket
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTicketPrompt(false)}
                  >
                    No, Thanks
                  </Button>
                </div>
              </div>
            )}

            {/* FAQ Suggestions */}
            {showFAQs && faqs.length > 0 && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  Quick questions:
                </p>
                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFAQClick(faq)}
                    className="w-full text-left p-2 text-sm bg-card border rounded-lg hover:bg-accent transition-colors"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
};

export default FloatingChatWidget;
