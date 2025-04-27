import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/lib/user-context';
import { Course } from '@/lib/types';
import CanvasLayout from '@/components/layout/CanvasLayout';
import CourseCard from '@/components/course/CourseCard';
import TodoList from '@/components/dashboard/TodoList';
import ContinualLearningBanner from '@/components/dashboard/ContinualLearningBanner';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StudentDashboard = () => {
  console.log("Rendering StudentDashboard component");
  const { user } = useUser();
  console.log("User:", user);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  // Fetch student's courses (using demo data for now)
  const { data: apiCourses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/student/courses'],
    enabled: !!user,
  });
  
  // Use demo courses for display
  const courses = apiCourses.length > 0 ? apiCourses : demoCourses;
  
  console.log("Courses:", courses);
  console.log("isLoading:", isLoading);
  
  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  console.log("FilteredCourses:", filteredCourses);
  
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
          
          {/* Course Enrollment Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden h-full flex flex-col items-center justify-center p-8">
            <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-neutral-500 dark:text-neutral-400">+</span>
            </div>
            <h3 className="font-medium text-neutral-800 dark:text-white text-base mb-2">
              Join a New Course
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center mb-4">
              Enter an access code to enroll in a new course
            </p>
            <Button variant="outline">Enter Course Code</Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-medium text-neutral-800 dark:text-white text-lg mb-2">
            No courses found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            {searchTerm ? 'Try searching with different keywords' : 'You haven\'t enrolled in any courses yet'}
          </p>
          {!searchTerm && (
            <Button className="mt-4" variant="default">
              Explore Courses
            </Button>
          )}
        </div>
      )}
    </CanvasLayout>
  );
};

export default StudentDashboard;