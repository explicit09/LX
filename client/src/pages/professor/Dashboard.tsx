import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/lib/user-context';
import { Course } from '@/lib/types';
import CanvasLayout from '@/components/layout/CanvasLayout';
import CourseCard from '@/components/course/CourseCard';
import TodoList from '@/components/dashboard/TodoList';
import ContinualLearningBanner from '@/components/dashboard/ContinualLearningBanner';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const ProfessorDashboard = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    accessCode: generateAccessCode()
  });
  
  // Fetch professor's courses
  const { data: courses = [], isLoading, refetch } = useQuery<Course[]>({
    queryKey: ['/api/professor/courses'],
    enabled: !!user,
  });
  
  // Generate an access code based on course name or timestamp
  function generateAccessCode(courseName: string = '') {
    // Use the first 3 characters of course name (uppercase) or current time for uniqueness
    const prefix = courseName.length > 0 
      ? courseName.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
      : 'CRS';
    
    // Use timestamp for uniqueness - last 3 digits of current timestamp
    const timestamp = Date.now().toString().slice(-3);
    
    return `${prefix}${timestamp}`;
  }
  
  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle input changes for new course form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle create course
  const handleCreateCourse = async () => {
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
      
      await apiRequest('POST', '/api/professor/courses', newCourse);
      
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
      
      // Refetch courses to update the list
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
  
  // We should show a login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in to access your professor dashboard.
          </p>
          <Button asChild>
            <a href="/auth">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <CanvasLayout 
      title="Dashboard" 
      rightSidebar={<TodoList />}
    >
      {/* Continual Learning Banner */}
      <ContinualLearningBanner />
      
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
      
      {/* Courses Grid */}
      {isLoading ? (
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
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-medium text-neutral-800 dark:text-white text-lg mb-2">
            No courses found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            {searchTerm ? 'Try searching with different keywords' : 'You haven\'t created any courses yet'}
          </p>
          {!searchTerm && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      )}
    </CanvasLayout>
  );
};

export default ProfessorDashboard;