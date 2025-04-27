import React from 'react';
import { Link } from 'wouter';
import { Course } from '@/lib/types';
import { Calendar, Users, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  newItems?: number;
  isProfessor?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, newItems, isProfessor = false }) => {
  // Format date for display
  const formattedDate = course.startDate 
    ? formatDistanceToNow(new Date(course.startDate), { addSuffix: true })
    : formatDistanceToNow(new Date(course.createdAt), { addSuffix: true });
  
  // Prevent event bubbling to parent div for links
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden h-full flex flex-col hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors cursor-pointer"
      onClick={() => window.location.href = isProfessor 
        ? `/professor/courses/${course.id}` 
        : `/courses/${course.id}/modules`}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-neutral-800 dark:text-white text-lg">
            {course.name}
          </h3>
          
          {newItems && newItems > 0 && (
            <Badge variant="default" className="ml-2 bg-blue-500 hover:bg-blue-600">
              {newItems} New
            </Badge>
          )}
        </div>
        
        <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2">
          {course.description || 'No description available'}
        </p>
      </div>
      
      {/* Card Body */}
      <div className="flex-1 p-5">
        <div className="space-y-3">
          {/* Course stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-neutral-500 dark:text-neutral-400 mr-2" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-neutral-500 dark:text-neutral-400 mr-2" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {course.studentCount || 0} Students
              </span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-neutral-500 dark:text-neutral-400 mr-2" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {course.materialCount || 0} Materials
              </span>
            </div>
            <div className="flex items-center">
              <ExternalLink className="h-4 w-4 text-neutral-500 dark:text-neutral-400 mr-2" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                Code: {course.accessCode}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
        {isProfessor ? (
          <div className="flex justify-between items-center">
            <Link 
              href={`/professor/courses/${course.id}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
              onClick={handleLinkClick}
            >
              View Course
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <Link 
              href={`/professor/courses/${course.id}/analytics`}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center"
              onClick={handleLinkClick}
            >
              Analytics
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center">
              View Course
              <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;