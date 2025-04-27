import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Course } from "@/lib/types";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import CourseCard from "@/components/professor/CourseCard";
import CreateCourseModal from "@/components/professor/CreateCourseModal";
import UploadMaterialsModal from "@/components/professor/UploadMaterialsModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

const Courses = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [uploadMaterialsModalOpen, setUploadMaterialsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();

  // Fetch courses data
  const { 
    data: courses = [], 
    isLoading: coursesLoading, 
    refetch: refetchCourses 
  } = useQuery<Course[]>({
    queryKey: ["/api/professor/courses"],
  });

  const handleCreateCourse = () => {
    setCreateCourseModalOpen(true);
  };

  const handleUploadMaterials = (courseId?: number) => {
    setSelectedCourseId(courseId);
    setUploadMaterialsModalOpen(true);
  };

  const handleManageCourse = (courseId: number) => {
    // Navigate to course detail page
    navigate(`/professor/courses/${courseId}`);
  };

  const handleViewReports = (courseId: number) => {
    navigate(`/professor/reports/${courseId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600">Manage and organize your courses</p>
            </div>
            
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
          
          {/* Course List */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">All Courses</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Recent</option>
                    <option>Name</option>
                    <option>Students</option>
                  </select>
                </div>
              </div>
              
              {coursesLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                  <Button onClick={handleCreateCourse}>Create Your First Course</Button>
                </div>
              ) : (
                courses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onManage={handleManageCourse}
                    onUpload={handleUploadMaterials}
                    onReports={handleViewReports}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Modals */}
      <CreateCourseModal 
        open={createCourseModalOpen}
        onOpenChange={setCreateCourseModalOpen}
        onCourseCreated={() => refetchCourses()}
      />
      
      <UploadMaterialsModal
        open={uploadMaterialsModalOpen}
        onOpenChange={setUploadMaterialsModalOpen}
        preselectedCourseId={selectedCourseId}
        onUploadComplete={() => {
          refetchCourses();
        }}
      />
    </div>
  );
};

export default Courses;
