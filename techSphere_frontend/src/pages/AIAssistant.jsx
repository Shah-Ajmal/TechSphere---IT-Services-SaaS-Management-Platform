import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  Ticket as TicketIcon,
  HelpCircle,
} from "lucide-react";
import {
  sendChatMessage,
  createTicketFromChat,
  getFAQs,
} from "@/services/chatService";
import { useAppSelector } from "@/redux/hooks";

const AIAssistant = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hello ${
        user?.name || "there"
      }! 👋 I'm your TechSphere AI Assistant. I'm here to help you with:\n\n• Account and billing questions\n• Service recommendations\n• Technical troubleshooting\n• Platform navigation\n• Creating support tickets\n\nWhat can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketPrompt, setShowTicketPrompt] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await getFAQs();
        if (response.success) {
          setFaqs(response.data.faqs);
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

    try {
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

        if (response.data.suggestTicket) {
          setShowTicketPrompt(true);
        }
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or create a support ticket for assistance.",
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
          text: `✅ Perfect! I've created support ticket #${response.data.ticket._id.slice(
            -6
          )} for you. Our support team will review it shortly and get back to you. You can track the status in your Tickets page.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
        setShowTicketPrompt(false);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        role: "assistant",
        text: "I encountered an issue creating the ticket. Please visit the Tickets page to create one manually.",
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
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">
              Your intelligent support companion, powered by Google Gemini
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-250px)]">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat
                </CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.text}
                      </p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce delay-100" />
                        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Ticket Prompt */}
                {showTicketPrompt && !isLoading && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm font-medium mb-3">
                      🎫 Would you like me to create a support ticket for this
                      issue?
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreateTicket}>
                        <TicketIcon className="h-4 w-4 mr-2" />
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

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
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
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - FAQs */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleFAQClick(faq)}
                  className="w-full text-left p-3 text-sm bg-muted hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="font-medium mb-1">{faq.question}</div>
                  <Badge variant="secondary" className="text-xs">
                    {faq.category}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What I Can Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-1.5" />
                <p>Answer account & billing questions</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-1.5" />
                <p>Help with technical issues</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-1.5" />
                <p>Guide you through the platform</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-1.5" />
                <p>Create support tickets</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-1.5" />
                <p>Explain pricing & features</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
