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
    accessCode: generateRandomCode()
  });
  
  // Demo courses data for testing
  const demoCourses: Course[] = [
    {
      id: 1,
      name: "Introduction to Leadership",
      description: "A foundation course exploring leadership theories and application",
      accessCode: "LEAD101",
      professorId: 1,
      createdAt: "2025-01-15T12:00:00Z",
      startDate: "2025-02-01T00:00:00Z",
      studentCount: 24,
      materialCount: 12
    },
    {
      id: 2,
      name: "Ethics in Modern Organizations",
      description: "Ethical frameworks and case studies in organizational settings",
      accessCode: "ETH202",
      professorId: 2,
      createdAt: "2025-01-20T14:30:00Z",
      startDate: "2025-02-10T00:00:00Z",
      studentCount: 18,
      materialCount: 9
    },
    {
      id: 3,
      name: "Data-Driven Decision Making",
      description: "Using data and analytics to inform business decisions",
      accessCode: "DATA303",
      professorId: 1,
      createdAt: "2025-01-25T09:45:00Z",
      startDate: "2025-02-15T00:00:00Z",
      studentCount: 32,
      materialCount: 15
    }
  ];
  
  // Fetch professor's courses (using demo data for now)
  const { data: apiCourses = [], isLoading, refetch } = useQuery<Course[]>({
    queryKey: ['/api/professor/courses'],
    enabled: !!user,
  });
  
  // Use demo courses for display
  const courses = apiCourses.length > 0 ? apiCourses : demoCourses;
  
  // Generate a random access code
  function generateRandomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
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
        accessCode: generateRandomCode()
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
  
  // For demo purposes, we'll render the UI even if user is null
  // In a real app, we would redirect to login or show a message
  
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
                      onClick={() => setNewCourse(prev => ({ ...prev, accessCode: generateRandomCode() }))}
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
              newItems={Math.floor(Math.random() * 4)} // Random number for demo
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