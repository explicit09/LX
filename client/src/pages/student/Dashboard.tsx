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
      <header className="bg-white py-3 px-6 border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center space-x-1" onClick={navigateToLanding} style={{ cursor: 'pointer' }}>
              <img 
                src={LogoImage} 
                alt="LEARN-X Logo" 
                className="h-9" 
              />
              <div className="font-bold text-xl ml-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LEARN-X
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-600 border-blue-200 hidden md:flex items-center hover:bg-blue-50 hover:text-blue-700" 
              onClick={() => refetchCourses()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">Student Account</p>
                </div>
              )}
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
                {user?.name.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r h-[calc(100vh-56px)] sticky top-14 hidden md:block shadow-sm">
          <nav className="p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 px-3">
                <p className="text-xs font-semibold text-gray-500">NAVIGATION</p>
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-medium">3</span>
                </div>
              </div>
              <div className="space-y-1">
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-md font-medium text-sm border-l-2 border-blue-600"
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
            
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 mb-2 px-3">MY COURSES</p>
              {courses.length > 0 ? (
                <div className="space-y-1">
                  {courses.slice(0, 5).map((course) => (
                    <a 
                      key={course.id}
                      href={`/student/course/${course.id}/chat`}
                      className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium text-sm group"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                      <span className="truncate">{course.name}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">No courses yet</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleJoinCourse}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 mt-1 text-xs h-auto"
                  >
                    + Join a course
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-xs text-gray-600 mb-3">Contact your professor or institution for assistance with course materials</p>
                <div className="text-xs text-blue-600">
                  <a href="#" className="hover:underline">Contact Support</a>
                </div>
              </div>
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