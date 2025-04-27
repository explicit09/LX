import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Plus, Upload, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import CourseCard from "@/components/professor/CourseCard";
import CreateCourseModal from "@/components/professor/CreateCourseModal";
import UploadMaterialsModal from "@/components/professor/UploadMaterialsModal";
import MaterialItem from "@/components/professor/MaterialItem";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Course, Material } from "@/lib/types";

const ProfessorDashboard = () => {
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

  // Fetch recent materials
  const { 
    data: recentMaterials = [], 
    isLoading: materialsLoading, 
    refetch: refetchMaterials 
  } = useQuery<Material[]>({
    queryKey: ["/api/recent-materials"],
    // This endpoint doesn't exist yet, but we're mocking it for now
    enabled: false, // Disable until the endpoint is implemented
  });

  const handleCreateCourse = () => {
    setCreateCourseModalOpen(true);
  };

  const handleUploadMaterials = (courseId?: number) => {
    setSelectedCourseId(courseId);
    setUploadMaterialsModalOpen(true);
  };

  const handleViewMaterial = (material: Material) => {
    // Implement viewing a material - extract filename from path
    const filename = material.path.split('/').pop();
    window.open(`/api/uploads/${material.type}/${filename}`, "_blank");
  };

  const handleDeleteMaterial = (material: Material) => {
    // Implement deleting a material
    toast({
      title: "Not implemented",
      description: "Material deletion is not yet implemented.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your Dashboard</h1>
            <p className="text-gray-600">Manage your courses and materials from this dashboard.</p>
          </div>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Create Course Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create Course</h3>
                  <Plus className="text-primary h-5 w-5" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Create a new course and generate access codes for your students.
                </p>
                <Button 
                  onClick={handleCreateCourse}
                  className="w-full"
                >
                  Create New Course
                </Button>
              </CardContent>
            </Card>
            
            {/* Upload Materials Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Upload Materials</h3>
                  <Upload className="text-primary h-5 w-5" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Upload new PDFs or audio files to your existing courses.
                </p>
                <Button 
                  onClick={() => handleUploadMaterials()}
                  className="w-full"
                >
                  Upload Materials
                </Button>
              </CardContent>
            </Card>
            
            {/* View Reports Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Student Reports</h3>
                  <BarChart className="text-primary h-5 w-5" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  View reports and analytics on student interactions with course materials.
                </p>
                <Button 
                  onClick={() => navigate("/professor/reports")}
                  className="w-full"
                >
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Course List */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Your Courses</h2>
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
                    onManage={(id) => navigate(`/professor/courses/${id}`)}
                    onUpload={(id) => handleUploadMaterials(id)}
                    onReports={(id) => navigate(`/professor/reports/${id}`)}
                  />
                ))
              )}
            </CardContent>
          </Card>
          
          {/* Recent Materials */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Recent Materials</h2>
                <Link to="/professor/materials">
                  <span className="text-primary hover:underline text-sm font-medium cursor-pointer">View All</span>
                </Link>
              </div>
              
              {materialsLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading materials...</p>
                </div>
              ) : recentMaterials.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You haven't uploaded any materials yet.</p>
                  <Button onClick={() => handleUploadMaterials()}>Upload Your First Material</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMaterials.map(material => (
                    <MaterialItem
                      key={material.id}
                      material={material}
                      onView={handleViewMaterial}
                      onDelete={handleDeleteMaterial}
                    />
                  ))}
                </div>
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
          refetchMaterials();
        }}
      />
    </div>
  );
};

export default ProfessorDashboard;
