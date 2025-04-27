import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, MessageCircle, Search, Filter } from "lucide-react";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import { Course, ChatItem } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChatHistory = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  // Fetch enrolled courses
  const { 
    data: courses = [], 
    isLoading: coursesLoading 
  } = useQuery<Course[]>({
    queryKey: ["/api/student/courses"],
  });

  // Mock chat history data
  const mockChatHistory: Array<ChatItem & { courseName: string }> = [
    {
      id: 1,
      studentId: 1,
      courseId: 1,
      courseName: "Introduction to Machine Learning",
      question: "Can you explain the difference between supervised and unsupervised learning?",
      answer: "Supervised learning uses labeled data where the algorithm learns to map inputs to known outputs. Examples include classification and regression tasks.\n\nUnsupervised learning works with unlabeled data to find patterns or structure. Examples include clustering and dimensionality reduction.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
      sources: JSON.stringify(["Module 20.pdf (Pages 12-15)"])
    },
    {
      id: 2,
      studentId: 1,
      courseId: 1,
      courseName: "Introduction to Machine Learning",
      question: "What is backpropagation and how does it work?",
      answer: "Backpropagation is an algorithm used to train neural networks. It works by calculating the gradient of the loss function with respect to each weight in the network, starting from the output layer and moving backwards through the layers.\n\nThis allows the network to adjust weights to minimize error through gradient descent.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
      sources: JSON.stringify(["Module 21.pdf (Pages 8-10)", "Audio recording (Apr 13)"])
    },
    {
      id: 3,
      studentId: 1,
      courseId: 2,
      courseName: "Advanced Neural Networks",
      question: "What are convolutional neural networks and why are they useful for image processing?",
      answer: "Convolutional Neural Networks (CNNs) are a specialized type of neural network designed for processing structured grid data like images. They use convolutional layers that apply filters to detect features.\n\nCNNs are particularly useful for image processing because they can automatically learn hierarchical features, from simple edges to complex shapes, and maintain spatial relationships in the data. They also use parameter sharing and pooling to reduce complexity.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      sources: JSON.stringify(["Deep Learning Fundamentals.pdf (Pages 45-52)"])
    }
  ];

  // Filter chat history based on search query and selected course
  const filteredHistory = mockChatHistory.filter(chat => {
    const matchesQuery = 
      chat.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      chat.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = selectedCourseId === "all" || chat.courseId.toString() === selectedCourseId;
    
    return matchesQuery && matchesCourse;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleChatItemClick = (chat: ChatItem) => {
    // Navigate to the chat interface for this course
    navigate(`/student/course/${chat.courseId}/chat`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
              <p className="text-gray-600">Review your previous conversations with course assistants</p>
            </div>
          </div>
          
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search conversations..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select
                    value={selectedCourseId}
                    onValueChange={setSelectedCourseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Chat History List */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Conversation History</h2>
              
              {coursesLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading chat history...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCourseId !== "all"
                      ? "No conversations match your search filters."
                      : "You haven't had any conversations yet."}
                  </p>
                  {!searchQuery && selectedCourseId === "all" && courses.length > 0 && (
                    <Button onClick={() => navigate(`/student/course/${courses[0].id}/chat`)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start a Conversation
                    </Button>
                  )}
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredHistory.map((chat, index) => (
                    <AccordionItem 
                      key={chat.id} 
                      value={chat.id.toString()}
                      className="border rounded-md overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex flex-col items-start text-left">
                          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                            <span>{chat.courseName}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-normal">{formatDate(chat.timestamp)}</span>
                          </div>
                          <p className="text-gray-900">{chat.question}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-gray-50 border-t">
                        <div className="space-y-3">
                          <p className="text-gray-800 whitespace-pre-wrap">{chat.answer}</p>
                          
                          {chat.sources && (
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <p className="text-xs text-gray-500">
                                Sources: {JSON.parse(chat.sources).join(", ")}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-end pt-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleChatItemClick(chat)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Continue this conversation
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ChatHistory;
