import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, RefreshCw, Info, Book, BrainCircuit, User } from "lucide-react";
import { Course, ChatItem } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";

// Import logo
import LogoImage from "@assets/LEARN-X Logo.png";

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
  initialChatHistory,
  onClearChat,
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch chat history
  const { 
    data: fetchedHistory,
    isLoading: loadingHistory,
    refetch: refetchHistory
  } = useQuery<ChatItem[]>({
    queryKey: [`/api/student/courses/${courseId}/chat`],
    staleTime: 60000, // 1 minute
    enabled: false, // Don't fetch automatically as we'll handle this based on initialChatHistory
  });

  // Convert initial chat history to chat messages
  useEffect(() => {
    if (initialChatHistory && initialChatHistory.length > 0) {
      const formattedChat = initialChatHistory.flatMap((item) => [
        {
          id: `user-${item.id}`,
          role: "user" as "user",
          content: item.question,
          timestamp: new Date(item.timestamp),
        },
        {
          id: `assistant-${item.id}`,
          role: "assistant" as "assistant",
          content: item.answer,
          sources: item.sources ? item.sources.split(",") : [],
          timestamp: new Date(item.timestamp),
        },
      ]);
      setChatHistory(formattedChat);
    } else {
      // If no initial history provided, try to fetch it
      refetchHistory();
    }
  }, [initialChatHistory]);

  // Convert fetched history to chat messages when it arrives
  useEffect(() => {
    if (fetchedHistory) {
      const formattedChat = fetchedHistory.flatMap((item) => [
        {
          id: `user-${item.id}`,
          role: "user" as "user",
          content: item.question,
          timestamp: new Date(item.timestamp),
        },
        {
          id: `assistant-${item.id}`,
          role: "assistant" as "assistant",
          content: item.answer,
          sources: item.sources ? item.sources.split(",") : [],
          timestamp: new Date(item.timestamp),
        },
      ]);
      setChatHistory(formattedChat);
    }
  }, [fetchedHistory]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", `/api/student/courses/${courseId}/ask`, { question });
      return response.json();
    },
    onSuccess: (data: ChatItem) => {
      // Add the question and answer to the chat history
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${data.id}`,
        role: "assistant",
        content: data.answer,
        sources: data.sources ? data.sources.split(",") : [],
        timestamp: new Date(data.timestamp),
      };
      
      setChatHistory((prev) => [...prev, userMessage, assistantMessage]);
      setIsThinking(false);
      setMessage(""); // Clear input field

      // Invalidate the chat history query to update the cached data
      queryClient.invalidateQueries({queryKey: [`/api/student/courses/${courseId}/chat`]});
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsThinking(false);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsThinking(true);
    sendMessage.mutate(message.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg overflow-hidden border shadow-sm">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3">
            <img src={LogoImage} alt="LEARN-X Logo" className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Course Assistant</h2>
            <div className="text-sm text-blue-100">Ask questions about {courseName}</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => refetchHistory()}
          disabled={loadingHistory}
          className="text-white bg-white/10 hover:bg-white/20"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingHistory ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4 h-[calc(100vh-280px)]">
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="max-w-md p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                AI Course Assistant
              </h3>
              <p className="text-gray-600 mb-4">
                I can help you understand your course materials by answering questions based on the content uploaded by your professor.
              </p>
              <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-gray-600 mb-4">
                <p className="font-medium text-blue-700 mb-1">Example questions:</p>
                <ul className="text-left space-y-2 pl-2">
                  <li>• "Explain the key concepts from Chapter 3"</li>
                  <li>• "What are the main arguments in Smith's theory?"</li>
                  <li>• "Summarize the audio lecture from last week"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-6 ${msg.role === 'assistant' ? 'pl-2' : 'pl-4'}`}
              >
                <div className="flex items-start">
                  <div 
                    className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${
                      msg.role === 'assistant' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <BrainCircuit className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1 ml-1">
                      {msg.role === 'assistant' ? 'LEARN-X Assistant' : 'You'}
                    </div>
                    <div 
                      className={`p-4 rounded-lg shadow-sm ${
                        msg.role === 'assistant' 
                          ? 'bg-white border border-gray-100 text-gray-800' 
                          : 'bg-blue-50 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                    
                    {/* Sources section for assistant */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
                                <Book className="h-3 w-3 mr-1" />
                                <span>Sources ({msg.sources.length})</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent align="start" className="max-w-sm bg-blue-900 text-white">
                              <div className="text-xs font-semibold">Based on these materials:</div>
                              <ul className="text-xs list-disc pl-4 pt-1">
                                {msg.sources.map((source, idx) => (
                                  <li key={idx} className="text-blue-100">{source}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-end space-x-2">
          <Textarea
            placeholder="Ask anything about your course materials..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
            disabled={isThinking}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isThinking || !message.trim()}
            className="h-[60px] px-5 bg-blue-600 hover:bg-blue-700"
          >
            {isThinking ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Powered by OpenAI GPT-4o and course materials
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;