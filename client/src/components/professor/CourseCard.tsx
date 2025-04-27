import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Copy } from "lucide-react";
import { Course } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CourseCardProps {
  course: Course;
  onManage: (courseId: number) => void;
  onUpload: (courseId: number) => void;
  onReports: (courseId: number) => void;
}

const CourseCard = ({ course, onManage, onUpload, onReports }: CourseCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyAccessCode = () => {
    navigator.clipboard.writeText(course.accessCode);
    setCopied(true);
    toast({
      title: "Access code copied!",
      description: "The access code has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
        <Badge variant={course.startDate && new Date(course.startDate) > new Date() ? "outline" : "default"}>
          {course.startDate && new Date(course.startDate) > new Date() ? "Upcoming" : "Active"}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Access Code</p>
          <div className="flex items-center">
            <span className="text-sm font-medium font-mono bg-gray-100 px-2 py-1 rounded mr-2">
              {course.accessCode}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className={copied ? "text-green-600" : "text-primary hover:text-primary/80"}
              onClick={copyAccessCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center">
          <Users className="h-4 w-4 text-gray-400 mr-1" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Students</p>
            <p className="text-sm font-medium">{course.studentCount || 0} enrolled</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="text-sm font-medium">{formatDate(course.startDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-gray-400 mr-1" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Materials</p>
            <p className="text-sm font-medium">{course.materialCount || 0} files</p>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-primary text-primary hover:bg-primary/5"
          onClick={() => onManage(course.id)}
        >
          Manage
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpload(course.id)}
        >
          Upload
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onReports(course.id)}
        >
          Reports
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
