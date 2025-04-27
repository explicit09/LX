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
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch student's courses 
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/student/courses'],
    enabled: !!user,
  });
  
  // Filter courses based on search term
  const filteredCourses = courses.filter((course: Course) => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // We should show a login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in to access your student dashboard.
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
      <ContinualLearningBanner 
        coursesInProgress={courses.length} 
        completionPercentage={courses.reduce((acc, course) => 
          acc + (course.completionPercentage || 0), 0) / (courses.length || 1)}
        timeSpentThisWeek={courses.reduce((acc, course) => 
          acc + (course.timeSpentThisWeek || 0), 0)}
      />
      
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
          {filteredCourses.map((course: Course) => (
            <CourseCard 
              key={course.id} 
              course={course}
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