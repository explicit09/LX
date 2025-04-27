import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen } from "lucide-react";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import ChatInterface from "@/components/student/ChatInterface";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Course, ChatItem } from "@/lib/types";

const CourseChat = () => {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const [, navigate] = useLocation();

  // Fetch enrolled courses for the sidebar
  const { 
    data: courses = [], 
    isLoading: coursesLoading
  } = useQuery<Course[]>({
    queryKey: ["/api/student/courses"],
  });

  // Fetch the current course details
  const { 
    data: currentCourse,
    isLoading: courseLoading
  } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    enabled: !isNaN(courseId)
  });

  // Fetch chat history for this course
  const {
    data: chatHistory = [],
    isLoading: historyLoading,
    refetch: refetchHistory
  } = useQuery<ChatItem[]>({
    queryKey: ["/api/courses", courseId, "chat-history"],
    enabled: !isNaN(courseId)
  });

  const handleClearChat = async () => {
    // This would clear the chat history in a real implementation
    // For now, just refetch the history
    refetchHistory();
  };

  const activeStatus = courses.reduce((acc, course) => {
    acc[course.id] = course.id === courseId ? "active" : "inactive";
    return acc;
  }, {} as Record<number, string>);

  if (isNaN(courseId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Course</h1>
          <p className="text-gray-600 mb-4">The course ID is invalid.</p>
          <Button onClick={() => navigate("/student/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav courses={courses} activeStatus={activeStatus} />
        
        <main className="flex-1 overflow-auto bg-slate-50 flex flex-col">
          {/* Course Selection Header */}
          <div className="bg-white p-4 shadow-sm border-b border-gray-200">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 md:hidden"
                  onClick={() => navigate("/student/dashboard")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Course Assistant</h1>
                  <p className="text-sm text-gray-600">Ask questions about your course materials</p>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <label htmlFor="course-select" className="text-sm font-medium text-gray-700">Current Course:</label>
                  <Select
                    value={courseId.toString()}
                    onValueChange={(value) => navigate(`/student/course/${value}/chat`)}
                    disabled={coursesLoading}
                  >
                    <SelectTrigger id="course-select" className="w-[250px]">
                      <SelectValue placeholder={courseLoading ? "Loading..." : currentCourse?.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Interface */}
          {courseLoading || historyLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading chat assistant...</p>
            </div>
          ) : !currentCourse ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">Course Not Found</h2>
                <p className="text-gray-600 mb-4">This course doesn't exist or you don't have access to it.</p>
                <Button onClick={() => navigate("/student/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <ChatInterface
              courseId={courseId}
              courseName={currentCourse.name}
              initialChatHistory={chatHistory}
              onClearChat={handleClearChat}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseChat;
