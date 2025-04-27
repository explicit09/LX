import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Course } from "@/lib/types";
import { PlusCircle, MessageCircle, History } from "lucide-react";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import JoinCourseModal from "@/components/student/JoinCourseModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StudentDashboard = () => {
  const [, navigate] = useLocation();
  const [joinCourseModalOpen, setJoinCourseModalOpen] = useState(false);

  // Fetch enrolled courses
  const { 
    data: courses = [], 
    isLoading: coursesLoading, 
    refetch: refetchCourses 
  } = useQuery<Course[]>({
    queryKey: ["/api/student/courses"],
  });

  // Fetch recent chat history
  const { 
    data: recentChats = [],
    isLoading: chatsLoading
  } = useQuery({
    queryKey: ["/api/student/recent-chats"],
    // This endpoint doesn't exist yet, so disable it
    enabled: false
  });

  const handleJoinCourse = () => {
    setJoinCourseModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav courses={courses} activeStatus={{}} />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Access your courses and chat assistant</p>
          </div>
          
          {/* Enrolled Courses Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Enrolled Courses</h2>
              <Button variant="outline" onClick={handleJoinCourse}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Join Course
              </Button>
            </div>
            
            {coursesLoading ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
                  <Button onClick={handleJoinCourse}>Join Your First Course</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{course.name}</CardTitle>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <CardDescription>
                        {course.description || "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Date:</span>
                          <span>{formatDate(course.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Course ID:</span>
                          <span>{course.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Materials:</span>
                          <span>{course.materialCount || 0} files</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => navigate(`/student/course/${course.id}/chat`)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with Assistant
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Activity</h2>
            
            <Card>
              <CardContent className="p-6">
                {chatsLoading ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Loading recent activity...</p>
                  </div>
                ) : recentChats.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">You haven't interacted with any course assistants yet.</p>
                    {courses.length > 0 && (
                      <Button onClick={() => navigate(`/student/course/${courses[0].id}/chat`)}>
                        Start Chatting
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* This would render recent chat activity if we had data */}
                    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Introduction to Machine Learning</h4>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        "Can you explain the difference between supervised and unsupervised learning?"
                      </p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0"
                          onClick={() => navigate("/student/chat-history")}
                        >
                          <History className="w-3 h-3 mr-1" />
                          View History
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Join Course Modal */}
      <JoinCourseModal
        open={joinCourseModalOpen}
        onOpenChange={setJoinCourseModalOpen}
        onCourseJoined={() => refetchCourses()}
      />
    </div>
  );
};

export default StudentDashboard;
