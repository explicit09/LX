import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatItem } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  courseId: number;
  courseName: string;
  initialChatHistory?: ChatItem[];
  onClearChat?: () => void;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources?: string[];
  timestamp: Date;
}

const ChatInterface = ({ 
  courseId, 
  courseName, 
  initialChatHistory = [],
  onClearChat 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chat with a welcome message and history if provided
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      role: "assistant" as const,
      content: `Hello! I'm your ${courseName} course assistant. I can help answer questions about the course materials, explain concepts, or point you to relevant resources. What would you like to know about today?`,
      timestamp: new Date(),
    };

    const historicalMessages = initialChatHistory.map((item) => ({
      id: item.id.toString(),
      role: "user" as const,
      content: item.question,
      timestamp: new Date(item.timestamp),
      followUp: {
        id: `response-${item.id}`,
        role: "assistant" as const,
        content: item.answer,
        sources: item.sources ? JSON.parse(item.sources) : undefined,
        timestamp: new Date(item.timestamp),
      }
    }));

    const allMessages: ChatMessage[] = [welcomeMessage];
    
    // Flatten the chat history into a sequence of messages
    historicalMessages.forEach(msg => {
      allMessages.push(msg);
      if (msg.followUp) {
        allMessages.push(msg.followUp);
      }
    });
    
    setMessages(allMessages);
  }, [courseName, initialChatHistory]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", `/api/courses/${courseId}/chat`, {
        question: input,
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `response-${data.id}`,
        role: "assistant",
        content: data.answer,
        sources: data.sources ? JSON.parse(data.sources) : undefined,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Remove the user message since it failed
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = messages.find(m => m.id === "welcome");
    setMessages(welcomeMessage ? [welcomeMessage] : []);
    
    if (onClearChat) {
      onClearChat();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto chat-container mb-4 p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start",
              message.role === "user" ? "justify-end" : ""
            )}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
              </div>
            )}
            
            <div
              className={cn(
                "rounded-lg p-4 shadow-sm max-w-3xl",
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="text-xs text-gray-500">
                    Sources: {message.sources.join(", ")}
                  </p>
                </div>
              )}
            </div>
            
            {message.role === "user" && (
              <div className="flex-shrink-0 ml-3">
                <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your course materials..."
              rows={2}
              className="resize-none"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="flex items-center text-xs text-gray-500">
            <Bot className="h-3 w-3 mr-1" />
            Responses are generated from your course materials
          </div>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-primary"
            onClick={handleClearChat}
          >
            Clear conversation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
