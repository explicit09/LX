import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Plus, RefreshCw, Loader2, Book, Calendar, User } from "lucide-react";
import { Course } from "@/lib/types";
import { useUser } from "@/lib/user-context";

// Import logo
import LogoImage from "@assets/LEARN-X Logo.png";

import CourseCard from "@/components/student/CourseCard";
import JoinCourseModal from "@/components/student/JoinCourseModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

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

  const navigateToLanding = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Bar */}
      <header className="bg-white py-3 px-6 border-b sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={LogoImage} 
              alt="LEARN-X Logo" 
              className="h-8 cursor-pointer" 
              onClick={navigateToLanding}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hidden md:flex items-center" 
              onClick={() => refetchCourses()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              )}
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {user?.name.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r h-[calc(100vh-56px)] sticky top-14 hidden md:block">
          <nav className="p-4">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-3">MAIN MENU</p>
              <div className="space-y-1">
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-md font-medium text-sm"
                >
                  <Book className="h-4 w-4 mr-3" />
                  My Courses
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium text-sm"
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Schedule
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium text-sm"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </a>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 px-3">MY LEARNING</p>
              {courses.length > 0 ? (
                <div className="space-y-1">
                  {courses.slice(0, 5).map((course) => (
                    <a 
                      key={course.id}
                      href={`/student/course/${course.id}/chat`}
                      className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium text-sm"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {course.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 px-3">No courses yet</p>
              )}
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                <p className="text-gray-600">View and manage your enrolled courses</p>
              </div>
              
              <Button onClick={handleJoinCourse} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Join Course
              </Button>
            </div>
            
            {/* Course List */}
            {isLoadingCourses ? (
              <div className="text-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading your courses...</p>
              </div>
            ) : isErrorCourses ? (
              <div className="text-center py-20">
                <div className="bg-red-50 text-red-500 p-4 rounded-lg inline-block mb-4">
                  <p className="font-medium">Failed to load courses</p>
                  <p className="text-sm mt-1">There was an error fetching your courses.</p>
                </div>
                <Button variant="outline" onClick={() => refetchCourses()}>
                  Try Again
                </Button>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border p-8">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't joined any courses yet. Use an access code provided by your professor to join a course.
                </p>
                <Button onClick={handleJoinCourse} className="bg-blue-600 hover:bg-blue-700">
                  Join Your First Course
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
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