import { Course } from "@/lib/types";
import { Book, Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CourseCardProps {
  course: Course;
  onChat: (courseId: number) => void;
  onViewMaterials: (courseId: number) => void;
}

const CourseCard = ({ course, onChat, onViewMaterials }: CourseCardProps) => {
  // Format the date to a readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Deterministic gradient based on course ID
  const getGradientForCourse = (courseId: number) => {
    const gradients = [
      'from-blue-500 to-blue-400',
      'from-blue-600 to-indigo-500',
      'from-indigo-500 to-purple-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-400',
      'from-cyan-500 to-blue-400',
    ];
    
    // Use course ID to determine gradient (ensures consistent colors per course)
    return gradients[courseId % gradients.length];
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full border border-gray-100">
      <div className={`h-3 w-full bg-gradient-to-r ${getGradientForCourse(course.id)}`}></div>
      
      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 mb-2">
            Active
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
        
        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-4 mt-4">
            {course.startDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>Started {formatDate(course.startDate)}</span>
              </div>
            )}
            
            {course.materialCount !== undefined && (
              <div className="flex items-center text-sm text-gray-500">
                <Book className="h-4 w-4 mr-2 text-blue-500" />
                <span>{course.materialCount || 0} Materials</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 p-4 flex gap-2 bg-gray-50">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-gray-700 border-gray-200"
          onClick={() => onViewMaterials(course.id)}
        >
          <Book className="h-4 w-4 mr-2 text-blue-500" />
          Materials
        </Button>
        
        <Button 
          size="sm" 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => onChat(course.id)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;