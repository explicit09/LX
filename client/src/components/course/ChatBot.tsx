import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, ThumbsUp, ThumbsDown, ExternalLink, X, ChevronDown, ChevronUp, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    page?: number;
    highlight?: string;
  }>;
}

interface ChatBotProps {
  moduleTitle: string;
  moduleId: number;
  initialMessages?: ChatMessage[];
  onSourceClick?: (source: { title: string; page?: number }) => void;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  demoMode?: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({
  moduleTitle,
  moduleId,
  initialMessages = [],
  onSourceClick,
  collapsed = false,
  onCollapseChange,
  demoMode = false
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update collapsed state
  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);
  
  // Notify parent of collapse change
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSubmitting(true);
    
    try {
      // Determine which API endpoint to use based on mode
      const apiEndpoint = demoMode 
        ? `/api/demo/ask` 
        : `/api/student/courses/${moduleId}/ask`;
      
      // Make API call to get AI response
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the sources from the API
      let sourcesList: { title: string, page?: number, highlight?: string }[] = [];
      
      if (data.sources) {
        const sourceNames = data.sources.split(',');
        sourcesList = sourceNames.map((source: string) => ({
          title: source.trim(),
          page: undefined, // In a real app, we would have more detailed source info
          highlight: undefined
        }));
      }
      
      // Create the bot message with the response
      const botMessage: ChatMessage = {
        id: data.id?.toString() || (Date.now() + 1).toString(),
        type: 'bot',
        text: data.answer || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: new Date(data.timestamp || Date.now()),
        sources: sourcesList.length > 0 ? sourcesList : undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // Handle source click
  const handleSourceClick = (source: { title: string; page?: number }) => {
    onSourceClick?.(source);
  };
  
  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };
  
  // Handle feedback (would normally send to backend)
  const handleFeedback = (messageId: string, isPositive: boolean) => {
    toast({
      title: 'Feedback recorded',
      description: `Thank you for your ${isPositive ? 'positive' : 'negative'} feedback.`,
    });
  };
  
  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };
  
  return (
    <div className={`h-full flex flex-col ${isCollapsed ? 'overflow-hidden' : ''}`}>
      {/* Chat Header */}
      <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
        <h2 className="font-medium text-neutral-800 dark:text-white">
          AI Tutor: '{moduleTitle}'
        </h2>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Collapsed view */}
      {isCollapsed ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Chat minimized. Click <ChevronUp className="h-3 w-3 inline" /> to expand.
          </p>
        </div>
      ) : (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                  Ask a question about this module
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  The AI will use only the content from this module to answer
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-neutral-800 dark:text-white' 
                      : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    
                    {message.type === 'bot' && message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sources:</p>
                        <div className="space-y-1">
                          {message.sources.map((source, index) => (
                            <div key={index} className="flex items-start">
                              <button
                                onClick={() => handleSourceClick(source)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {source.title}
                                {source.page && ` (p. ${source.page})`}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {message.type === 'bot' && (
                      <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-end">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className="text-neutral-500 hover:text-green-600 dark:hover:text-green-400"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about this module..."
                  className="resize-none pr-10"
                  rows={3}
                  disabled={isSubmitting}
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-2 top-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  <CornerDownLeft className="h-3 w-3 inline mr-1" />
                  Press <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-xs">⌘</kbd>+<kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-xs">Enter</kbd> to send
                </div>
                
                <div className="flex space-x-2">
                  {messages.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearChat}
                      disabled={isSubmitting}
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Thinking...
                      </div>
                    ) : (
                      <>
                        Send <SendHorizontal className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;