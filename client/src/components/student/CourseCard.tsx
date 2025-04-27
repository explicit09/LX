import { Course } from "@/lib/types";
import { Book, Calendar, MessageSquare } from "lucide-react";
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

  return (
    <Card className="overflow-hidden bg-white mb-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
            {course.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {course.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {course.startDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                  <span>Started {formatDate(course.startDate)}</span>
                </div>
              )}
              
              {course.materialCount !== undefined && (
                <div className="flex items-center text-sm text-gray-500">
                  <Book className="h-4 w-4 mr-1 text-primary" />
                  <span>{course.materialCount || 0} Materials</span>
                </div>
              )}
            </div>
          </div>
          
          <Badge variant="outline" className="bg-primary-50 text-primary border-primary">
            Active
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-3 p-4 pt-0 border-t border-gray-100">
        <Button variant="outline" size="sm" onClick={() => onViewMaterials(course.id)}>
          <Book className="h-4 w-4 mr-2" />
          View Materials
        </Button>
        <Button size="sm" onClick={() => onChat(course.id)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat Assistant
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;