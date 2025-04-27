import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { Course } from "@/lib/types";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import CourseCard from "@/components/student/CourseCard";
import JoinCourseModal from "@/components/student/JoinCourseModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [joinCourseModalOpen, setJoinCourseModalOpen] = useState(false);

  // Fetch enrolled courses
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses, 
    isError: isErrorCourses,
    refetch: refetchCourses 
  } = useQuery<Course[]>({
    queryKey: ["/api/student/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleJoinCourse = () => {
    setJoinCourseModalOpen(true);
  };

  const handleCourseJoined = () => {
    // Refresh the course list
    refetchCourses();
    
    toast({
      title: "Course joined!",
      description: "You have successfully joined a new course.",
    });
  };
  
  const handleChatWithAssistant = (courseId: number) => {
    setLocation(`/student/course/${courseId}/chat`);
  };
  
  const handleViewMaterials = (courseId: number) => {
    setLocation(`/student/course/${courseId}/materials`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600">View and manage your enrolled courses</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetchCourses()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleJoinCourse}>
                <Plus className="h-4 w-4 mr-2" />
                Join Course
              </Button>
            </div>
          </div>
          
          {/* Course List */}
          <Card>
            <CardContent className="p-6">
              {isLoadingCourses ? (
                <div className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-500">Loading your courses...</p>
                </div>
              ) : isErrorCourses ? (
                <div className="text-center py-10">
                  <p className="text-red-500 mb-2">Failed to load courses</p>
                  <Button variant="outline" onClick={() => refetchCourses()}>
                    Try Again
                  </Button>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">You haven't joined any courses yet.</p>
                  <Button onClick={handleJoinCourse}>Join Your First Course</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onChat={handleChatWithAssistant}
                      onViewMaterials={handleViewMaterials}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Modals */}
      <JoinCourseModal 
        open={joinCourseModalOpen}
        onOpenChange={setJoinCourseModalOpen}
        onCourseJoined={handleCourseJoined}
      />
    </div>
  );
};

export default Dashboard;