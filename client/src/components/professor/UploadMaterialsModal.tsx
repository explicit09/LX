import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Course } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";

interface UploadMaterialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCourseId?: number;
  onUploadComplete: () => void;
}

const UploadMaterialsModal = ({
  open,
  onOpenChange,
  preselectedCourseId,
  onUploadComplete,
}: UploadMaterialsModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCourses();
      if (preselectedCourseId) {
        setSelectedCourseId(preselectedCourseId.toString());
      }
    }
  }, [open, preselectedCourseId]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for demo purposes
      const mockCourses: Course[] = [
        {
          id: 1,
          name: "Introduction to Computer Science",
          description: "Learn the fundamentals of computer science and programming.",
          accessCode: "CS101",
          professorId: 1,
          createdAt: new Date().toISOString(),
          studentCount: 32,
          materialCount: 5
        },
        {
          id: 2,
          name: "Advanced Machine Learning",
          description: "Deep dive into neural networks and reinforcement learning.",
          accessCode: "ML404",
          professorId: 1,
          createdAt: new Date().toISOString(),
          studentCount: 18,
          materialCount: 7
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, use this API call instead:
      // const response = await fetch("/api/professor/courses");
      // if (response.ok) {
      //   const data = await response.json();
      //   setCourses(data);
      // }
      
      setCourses(mockCourses);
      
      // If we have a preselected course ID, set it
      if (preselectedCourseId) {
        setSelectedCourseId(preselectedCourseId.toString());
      } else if (mockCourses.length > 0) {
        // Otherwise select the first course
        setSelectedCourseId(mockCourses[0].id.toString());
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (!selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select a course.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // For demo purposes, simulate API upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, use this code:
      // for (const file of files) {
      //   const formData = new FormData();
      //   formData.append("file", file);
      //   
      //   const response = await fetch(`/api/courses/${selectedCourseId}/materials`, {
      //     method: "POST",
      //     body: formData,
      //     credentials: "include",
      //   });
      //
      //   if (!response.ok) {
      //     throw new Error(`Failed to upload ${file.name}`);
      //   }
      // }
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${files.length} files.`,
      });
      
      onUploadComplete();
      onOpenChange(false);
      setFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Upload Course Materials</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">
              Select Course
            </label>
            
            <Select
              disabled={isLoading || courses.length === 0}
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Loading courses..." : "Select a course"} />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Files</label>
            <FileUpload
              onFilesChange={handleFilesChange}
              accept=".pdf,.mp3,.wav"
              multiple={true}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !selectedCourseId || files.length === 0}
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMaterialsModal;
