import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Material, Course } from "@/lib/types";
import { Upload, Filter } from "lucide-react";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import MaterialItem from "@/components/professor/MaterialItem";
import UploadMaterialsModal from "@/components/professor/UploadMaterialsModal";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Materials = () => {
  const { toast } = useToast();
  const [uploadMaterialsModalOpen, setUploadMaterialsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");

  // Fetch courses for the filter dropdown
  const { 
    data: courses = [], 
    isLoading: coursesLoading 
  } = useQuery<Course[]>({
    queryKey: ["/api/professor/courses"],
  });

  // Fetch all materials
  const { 
    data: allMaterials = [], 
    isLoading: materialsLoading,
    refetch: refetchMaterials 
  } = useQuery<Material[]>({
    queryKey: ["/api/professor/materials"],
    // This endpoint doesn't exist yet, but would be ideal
    enabled: false, // Disable until the endpoint is implemented
  });

  // Mock materials data for the demo
  const mockMaterials: Material[] = [
    {
      id: 1,
      courseId: 1,
      name: "Module 20.pdf",
      type: "pdf",
      path: "pdfs/module_20.pdf",
      uploadDate: new Date().toISOString(),
    },
    {
      id: 2,
      courseId: 1,
      name: "Audio recording (transcribed)",
      type: "audio",
      path: "audio/lecture_recording.mp3",
      uploadDate: new Date().toISOString(),
      transcription: "This is a transcription of the audio recording..."
    },
    {
      id: 3,
      courseId: 2,
      name: "Module 21.pdf",
      type: "pdf",
      path: "pdfs/module_21.pdf",
      uploadDate: new Date().toISOString(),
    }
  ];

  // Filter materials based on selected course, search query, and file type
  const filteredMaterials = mockMaterials.filter(material => {
    const matchesCourse = selectedCourseId === "all" || material.courseId.toString() === selectedCourseId;
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFileType = fileTypeFilter === "all" || material.type === fileTypeFilter;
    return matchesCourse && matchesSearch && matchesFileType;
  });

  const handleUploadMaterials = () => {
    setUploadMaterialsModalOpen(true);
  };

  const handleViewMaterial = (material: Material) => {
    // Implement viewing a material
    window.open(`/api/uploads/${material.type}/${material.path.split('/').pop()}`, "_blank");
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Materials</h1>
              <p className="text-gray-600">Manage and organize your course materials</p>
            </div>
            
            <Button onClick={handleUploadMaterials}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Materials
            </Button>
          </div>
          
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search materials..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select
                    value={selectedCourseId}
                    onValueChange={setSelectedCourseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Select
                    value={fileTypeFilter}
                    onValueChange={setFileTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF Files</SelectItem>
                      <SelectItem value="audio">Audio Files</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Materials List */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">All Materials</h2>
              
              {materialsLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading materials...</p>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCourseId !== "all" || fileTypeFilter !== "all"
                      ? "No materials found matching your filters."
                      : "You haven't uploaded any materials yet."}
                  </p>
                  {!searchQuery && selectedCourseId === "all" && fileTypeFilter === "all" && (
                    <Button onClick={handleUploadMaterials}>Upload Your First Material</Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials.map(material => (
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
      
      {/* Upload Materials Modal */}
      <UploadMaterialsModal
        open={uploadMaterialsModalOpen}
        onOpenChange={setUploadMaterialsModalOpen}
        onUploadComplete={() => {
          refetchMaterials();
        }}
      />
    </div>
  );
};

export default Materials;
