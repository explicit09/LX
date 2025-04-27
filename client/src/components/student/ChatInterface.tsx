import React, { useState, useRef, useEffect } from 'react';
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

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  citations?: Citation[];
}

interface Citation {
  text: string;
  source: string;
  page?: number;
}

interface ChatInterfaceProps {
  courseId: number;
  courseName: string;
  initialChatHistory?: ChatItem[];
  onClearChat?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  courseId,
  courseName,
  initialChatHistory,
  onClearChat,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Welcome to ${courseName}! I'm your AI learning assistant. I can help you understand the course materials, answer questions, and explore related concepts. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSourcePanel, setShowSourcePanel] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
      setMessages(formattedChat);
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
      setMessages(formattedChat);
    }
  }, [fetchedHistory]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", `/api/student/courses/${courseId}/ask`, { question });
      return response.json();
    },
    onSuccess: (data: ChatItem) => {
      // Add the question and answer to the chat history
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
      };
      
      const assistantMessage: Message = {
        id: `assistant-${data.id}`,
        role: "assistant",
        content: data.answer,
        sources: data.sources ? data.sources.split(",") : [],
        timestamp: new Date(data.timestamp),
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setIsLoading(false);
      setInput(""); // Clear input field

      // Invalidate the chat history query to update the cached data
      queryClient.invalidateQueries({queryKey: [`/api/student/courses/${courseId}/chat`]});
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsLoading(true);
    sendMessage.mutate(input.trim());
  };

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation);
    setShowSourcePanel(true);
  };

  // Format message with citations
  const formatMessage = (message: Message) => {
    if (!message.citations) {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    // Simple citation formatting
    return (
      <div>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Sources:</p>
            <div className="space-y-1">
              {message.citations.map((citation, index) => (
                <button
                  key={index}
                  onClick={() => handleCitationClick(citation)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline block text-left"
                >
                  [{index + 1}] {citation.source} {citation.page && `(p. ${citation.page})`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{courseName}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">AI Learning Assistant</p>
          </div>
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              title="Start a new conversation"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              title="View conversation history"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {formatMessage(message)}
                <div className="text-xs mt-1 opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-neutral-100 dark:bg-neutral-800">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Form */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask a question about the course materials..."
                className="input min-h-[44px] max-h-[200px] py-3 pr-10 resize-none"
                rows={1}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                title="Upload a file"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary h-[44px] w-[44px] flex items-center justify-center rounded-full"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Responses are generated based on your course materials
          </div>
        </div>
      </div>
      
      {/* Source Panel */}
      <div 
        className={`w-96 border-l border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ${
          showSourcePanel ? 'translate-x-0' : 'translate-x-full'
        } absolute inset-y-0 right-0 lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-800">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <h3 className="font-medium">Source Details</h3>
            <button 
              onClick={() => setShowSourcePanel(false)}
              className="lg:hidden p-1 rounded-md text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeCitation ? (
              <div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-1">{activeCitation.source}</h4>
                  {activeCitation.page && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Page {activeCitation.page}</p>
                  )}
                </div>
                
                <div className="p-4 bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600 mb-4">
                  <blockquote className="italic">{activeCitation.text}</blockquote>
                </div>
                
                <div className="bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600 overflow-hidden">
                  <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <h5 className="font-medium">Source Document</h5>
                  </div>
                  <div className="p-6 flex justify-center items-center">
                    {/* Placeholder for PDF viewer */}
                    <div className="w-full aspect-[3/4] bg-neutral-200 dark:bg-neutral-600 rounded flex items-center justify-center">
                      <p className="text-neutral-600 dark:text-neutral-300">PDF Preview</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Open full document
                    </button>
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-center p-4">
                <p>Select a citation to view the source details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;