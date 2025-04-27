import React from 'react';
import { Link } from 'wouter';
import { MoreVertical, BookOpen, MessageCircle, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
  newItems?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  newItems = 0
}) => {
  // Function to generate a random gradient for course cards without images
  const getRandomGradient = () => {
    const colors = [
      'from-red-500 to-orange-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-orange-500',
      'from-teal-500 to-blue-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const gradient = getRandomGradient();
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden h-full flex flex-col">
      {/* Card Header/Image */}
      <div 
        className={`h-32 bg-gradient-to-r ${gradient} relative`}
      >
        {/* Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/courses/${course.id}/modules`}>Go to Course</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Mute Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* New Items Badge */}
        {newItems > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs rounded-full py-1 px-2 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> {newItems} new
          </div>
        )}
        
        {/* Semester Badge */}
        <div className="absolute bottom-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md py-1 px-2">
          {course.startDate ? new Date(course.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Ongoing'}
        </div>
      </div>
      
      {/* Course Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-neutral-800 dark:text-white text-base line-clamp-2 mb-1">
          {course.name}
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
          {course.description || 'No description available'}
        </p>
        
        {/* Course Stats */}
        <div className="mt-auto flex items-center text-xs text-neutral-500 dark:text-neutral-400 space-x-3">
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{course.materialCount || 0} materials</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{course.studentCount || 0} students</span>
          </div>
        </div>
      </div>
      
      {/* Course Action Footer */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80">
        <Link href={`/courses/${course.id}/modules`}>
          <a className="w-full flex justify-center py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-md text-sm font-medium transition-colors">
            Open Course
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;