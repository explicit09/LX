import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/lib/user-context';
import { Course } from '@/lib/types';
import CanvasLayout from '@/components/layout/CanvasLayout';
import CourseCard from '@/components/course/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Simple dashboard component with minimal complexity
const BasicDashboard = () => {
  // Hooks and state
  const { user, isLoading } = useUser();
  const { toast } = useToast();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    accessCode: generateAccessCode()
  });
  
  // Enhanced logging for authentication debugging
  useEffect(() => {
    console.log("BasicDashboard - Auth state:", { 
      isAuthenticated: !!user, 
      userObject: user ? { id: user.id, role: user.role, username: user.username } : null
    });
  }, [user]);
  
  // Error handling callback
  const handleCoursesError = useCallback((error: Error) => {
    console.error("Failed to fetch courses:", error);
    toast({
      title: "Failed to load courses",
      description: "There was a problem loading your courses. Please try refreshing the page.",
      variant: "destructive"
    });
  }, [toast]);
  
  // Fetch courses (only if user is available)
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses, 
    error: coursesError,
    refetch 
  } = useQuery<Course[]>({
    queryKey: ['/api/professor/courses'],
    enabled: !!user
  });
  
  // Handle error when it occurs
  useEffect(() => {
    if (coursesError) {
      handleCoursesError(coursesError as Error);
    }
  }, [coursesError, handleCoursesError]);
  
  // Log success
  useEffect(() => {
    if (courses && courses.length > 0) {
      console.log("Successfully loaded courses:", courses.length);
    }
  }, [courses]);
  
  // Manual course loading function for debugging
  const manualFetchCourses = useCallback(async () => {
    try {
      console.log("Attempting manual fetch of courses...");
      const response = await fetch('/api/professor/courses', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      console.log("Manual course fetch response:", response.status, response.statusText);
      
      if (!response.ok) {
        console.error("Error response:", await response.text());
        throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Manual course fetch successful:", data);
      toast({
        title: "Courses loaded",
        description: `Successfully loaded ${data.length} courses`,
      });
      
      // Force refresh
      queryClient.invalidateQueries({ queryKey: ['/api/professor/courses'] });
    } catch (error) {
      console.error("Manual fetch error:", error);
      toast({
        title: "Failed to load courses",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Generate an access code based on course name
  function generateAccessCode(courseName: string = '') {
    // Use the first 3 characters of course name or a default
    const prefix = courseName.length > 0 
      ? courseName.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
      : 'CRS';
    
    // Add timestamp for uniqueness
    const timestamp = Date.now().toString().slice(-3);
    
    return `${prefix}${timestamp}`;
  }
  
  // Filter courses based on search
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Form change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };
  
  // Create course handler
  const handleCreateCourse = async () => {
    // Validate form
    if (!newCourse.name) {
      toast({
        title: 'Missing information',
        description: 'Please provide a course name',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsCreating(true);
      
      // API request to create course
      const response = await apiRequest('POST', '/api/professor/courses', newCourse);
      
      // Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
      
      toast({
        title: 'Course created',
        description: `${newCourse.name} has been created successfully`,
      });
      
      // Reset form and close dialog
      setNewCourse({
        name: '',
        description: '',
        accessCode: generateAccessCode()
      });
      setIsCreateDialogOpen(false);
      
      // Refetch courses
      refetch();
    } catch (error) {
      console.error('Failed to create course:', error);
      toast({
        title: 'Failed to create course',
        description: 'An error occurred while creating the course',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Loading state while checking user authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-600 dark:border-t-neutral-300 rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Unauthorized state
  if (!user) {
    console.log("BasicDashboard - No user found");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in to access your professor dashboard.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  // Main dashboard layout
  return (
    <CanvasLayout 
      title="Dashboard" 
      rightSidebar={null}
    >
      <h1 className="text-3xl font-bold mb-6">Professor Dashboard</h1>
      
      {/* Debugging button */}
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={manualFetchCourses}
          className="bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
        >
          🛠️ Test API Connection
        </Button>
        <span className="ml-2 text-xs text-neutral-500">
          Debugging: Direct API call to /api/professor/courses
        </span>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <Input
            className="pl-10"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">All Courses</Button>
          <Button variant="outline">Current</Button>
          <Button variant="outline">Past</Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Enter the details for your new course. Students will use the access code to enroll.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCourse.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g. Introduction to Economics"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="A brief description of the course..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accessCode" className="text-right">
                    Access Code
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="accessCode"
                      name="accessCode"
                      value={newCourse.accessCode}
                      onChange={handleInputChange}
                      placeholder="e.g. ABC123"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewCourse(prev => ({ ...prev, accessCode: generateAccessCode(prev.name) }))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCreateCourse}
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Course'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Error message if courses fail to load */}
      {coursesError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading courses</AlertTitle>
          <AlertDescription>
            There was a problem loading your courses. The error was: {coursesError.message}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="mt-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Courses Grid */}
      {isLoadingCourses ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-600 dark:border-t-neutral-300 rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading your courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isProfessor={true}
            />
          ))}
          
          {/* Create Course Card */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden h-full flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                </div>
                <h3 className="font-medium text-neutral-800 dark:text-white text-base mb-2">
                  Create New Course
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center">
                  Set up a new course for your students
                </p>
              </div>
            </DialogTrigger>
          </Dialog>
        </div>
      ) : (
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full inline-block">
              <div className="bg-blue-100 dark:bg-blue-800 h-16 w-16 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-3">
              Welcome to Learn-X!
            </h2>
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              You haven't created any courses yet
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'No courses match your search criteria. Try different keywords or clear the search filter.' 
                : 'Get started by creating your first course. Students will use your course access code to join.'}
            </p>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Course
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <div className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
              <p>Need help getting started? <a href="#" className="text-blue-600 dark:text-blue-400 underline">View the tutorial</a></p>
            </div>
          </div>
        </div>
      )}
    </CanvasLayout>
  );
};

export default BasicDashboard;