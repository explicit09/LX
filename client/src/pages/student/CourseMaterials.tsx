import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, FileText, Mic, Download, ExternalLink, Loader2 } from "lucide-react";
import { Course, Material } from "@/lib/types";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MaterialItemProps {
  material: Material;
  onView: (material: Material) => void;
}

const MaterialItem = ({ material, onView }: MaterialItemProps) => {
  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="bg-primary/10 p-2 rounded">
          {material.type === "pdf" ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <Mic className="h-5 w-5 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{material.name}</h4>
          <p className="text-sm text-gray-500">
            Uploaded {formatDate(material.uploadDate)}
          </p>
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={() => onView(material)}
      >
        <ExternalLink className="h-4 w-4 mr-1" />
        View
      </Button>
    </div>
  );
};

const CourseMaterials = () => {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const [, navigate] = useLocation();
  
  // Fetch course details
  const { 
    data: course,
    isLoading: isLoadingCourse,
    isError: isErrorCourse
  } = useQuery<Course>({
    queryKey: [`/api/student/courses/${courseId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch course materials
  const { 
    data: materials = [],
    isLoading: isLoadingMaterials,
    isError: isErrorMaterials 
  } = useQuery<Material[]>({
    queryKey: [`/api/student/courses/${courseId}/materials`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const handleViewMaterial = (material: Material) => {
    // Extract filename from path
    const filename = material.path.split('/').pop();
    window.open(`/api/uploads/${material.type}/${filename}`, "_blank");
  };
  
  const isLoading = isLoadingCourse || isLoadingMaterials;
  const isError = isErrorCourse || isErrorMaterials;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex dashboard-content">
          <SideNav />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }
  
  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex dashboard-content">
          <SideNav />
          <main className="flex-1 p-8 flex flex-col items-center justify-center">
            <p className="text-red-500 mb-4">Error loading course materials.</p>
            <Button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</Button>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {/* Header with back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-2 -ml-3 text-gray-500"
              onClick={() => navigate("/student/dashboard")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
                {course.description && <p className="text-gray-600">{course.description}</p>}
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button onClick={() => navigate(`/student/course/${course.id}/chat`)}>
                  Chat with Assistant
                </Button>
              </div>
            </div>
          </div>
          
          {/* Materials List */}
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
            </CardHeader>
            <CardContent>
              {materials.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No materials available</h3>
                  <p className="text-gray-500">The professor hasn't uploaded any materials for this course yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
                    <MaterialItem
                      key={material.id}
                      material={material}
                      onView={handleViewMaterial}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CourseMaterials;