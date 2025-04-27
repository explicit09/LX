import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Course } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{file: string, status: 'pending' | 'success' | 'error', message?: string}[]>([]);
  const { toast } = useToast();

  // Fetch courses data
  const { 
    data: courses = [], 
    isLoading: isCoursesLoading,
    error: coursesError
  } = useQuery<Course[]>({
    queryKey: ["/api/professor/courses"],
    enabled: open, // Only fetch when modal is open
  });

  useEffect(() => {
    if (open) {
      // Reset state when opening modal
      setFiles([]);
      setUploadStatus([]);
      
      // If we have a preselected course ID, set it
      if (preselectedCourseId) {
        setSelectedCourseId(preselectedCourseId.toString());
      } else if (courses.length > 0) {
        // Otherwise select the first course
        setSelectedCourseId(courses[0].id.toString());
      }
    }
  }, [open, preselectedCourseId, courses]);

  // If there's a courses error, show it
  useEffect(() => {
    if (coursesError) {
      toast({
        title: "Error",
        description: "Failed to fetch your courses. Please try again later.",
        variant: "destructive",
      });
    }
  }, [coursesError, toast]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    // Reset upload status when files change
    setUploadStatus([]);
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
      // Initialize status for each file
      setUploadStatus(files.map(f => ({ 
        file: f.name, 
        status: 'pending'
      })));
      
      let successCount = 0;
      
      // Upload each file individually
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const formData = new FormData();
          formData.append("file", file);
          
          const response = await fetch(`/api/professor/courses/${selectedCourseId}/materials`, {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to upload ${file.name}`);
          }
          
          // Update status to success for this file
          setUploadStatus(prev => 
            prev.map((status, idx) => 
              idx === i ? { ...status, status: 'success' } : status
            )
          );
          
          successCount++;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          
          // Update status to error for this file
          setUploadStatus(prev => 
            prev.map((status, idx) => 
              idx === i ? { 
                ...status, 
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
              } : status
            )
          );
        }
      }
      
      // If at least one file uploaded successfully
      if (successCount > 0) {
        toast({
          title: "Upload Successful",
          description: `Successfully uploaded ${successCount} of ${files.length} files.`,
        });
        
        // Invalidate materials queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/professor/materials"] });
        queryClient.invalidateQueries({ queryKey: ["/api/professor/courses", selectedCourseId, "materials"] });
        
        onUploadComplete();
        
        // If all files uploaded successfully, close the modal
        if (successCount === files.length) {
          onOpenChange(false);
          setFiles([]);
        }
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload any files. Please try again.",
          variant: "destructive",
        });
      }
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
              disabled={isCoursesLoading || courses.length === 0}
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isCoursesLoading ? "Loading courses..." : "Select a course"} />
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
            
            {/* Upload status indicators */}
            {uploadStatus.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Upload Status:</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {uploadStatus.map((status, index) => (
                    <div 
                      key={index} 
                      className={`text-sm p-2 rounded flex items-center ${
                        status.status === 'success' 
                          ? 'bg-green-50 text-green-800' 
                          : status.status === 'error'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {status.status === 'pending' && (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <span className="flex-1 truncate">{status.file}</span>
                      <span className="ml-2">
                        {status.status === 'success' 
                          ? '✓ Uploaded' 
                          : status.status === 'error'
                            ? `✖ Failed${status.message ? `: ${status.message}` : ''}`
                            : 'Uploading...'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
