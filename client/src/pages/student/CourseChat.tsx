import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Course, ChatItem } from "@/lib/types";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import ChatInterface from "@/components/student/ChatInterface";
import { Button } from "@/components/ui/button";

const CourseChat = () => {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const [, navigate] = useLocation();
  
  // Fetch course details
  const { 
    data: course,
    isLoading: isLoadingCourse,
    isError: isErrorCourse
  } = useQuery<Course>({
    queryKey: [`/api/student/courses/${courseId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch chat history
  const { 
    data: chatHistory = [],
    isLoading: isLoadingChat,
    isError: isErrorChat,
    refetch: refetchChat
  } = useQuery<ChatItem[]>({
    queryKey: [`/api/student/courses/${courseId}/chat`],
    staleTime: 1000 * 60, // 1 minute
  });
  
  const isLoading = isLoadingCourse || isLoadingChat;
  const isError = isErrorCourse || isErrorChat;
  
  const handleClearChat = async () => {
    // We could implement this if needed
    // For now, just refresh the chat history
    refetchChat();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex dashboard-content">
          <SideNav />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }
  
  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex dashboard-content">
          <SideNav />
          <main className="flex-1 p-8 flex flex-col items-center justify-center">
            <p className="text-red-500 mb-4">Error loading course.</p>
            <Button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</Button>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {/* Header with back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-2 -ml-3 text-gray-500"
              onClick={() => navigate("/student/dashboard")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
                {course.description && <p className="text-gray-600">{course.description}</p>}
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/student/course/${course.id}/materials`)}
                >
                  View Materials
                </Button>
              </div>
            </div>
          </div>
          
          {/* Chat Interface */}
          <div className="h-[calc(100vh-240px)]">
            <ChatInterface
              courseId={courseId}
              courseName={course.name}
              initialChatHistory={chatHistory}
              onClearChat={handleClearChat}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseChat;