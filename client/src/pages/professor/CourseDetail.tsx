import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Course, Material } from "@/lib/types";
import { 
  Users, 
  FileText, 
  Upload, 
  BarChart, 
  ChevronLeft, 
  Lock,
  Clipboard, 
  Copy
} from "lucide-react";

import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialItem from "@/components/professor/MaterialItem";
import UploadMaterialsModal from "@/components/professor/UploadMaterialsModal";

const CourseDetail = () => {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadMaterialsModalOpen, setUploadMaterialsModalOpen] = useState(false);
  
  // Load course data from localStorage for demo
  useEffect(() => {
    // This would be a fetch in a real app
    const loadCourse = () => {
      setIsLoading(true);
      
      try {
        // Check localStorage for courses
        const courseAdded = localStorage.getItem('course_added');
        let foundCourse: Course | null = null;
        
        // Mock default courses
        const defaultCourses: Course[] = [
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
        
        // First check if it's one of our default courses
        foundCourse = defaultCourses.find(c => c.id === courseId) || null;
        
        // Then check if it's a newly created course
        if (!foundCourse && courseAdded) {
          try {
            const newCourse = JSON.parse(courseAdded);
            if (newCourse.id === courseId) {
              foundCourse = newCourse;
            }
          } catch (e) {
            console.error("Error parsing course data", e);
          }
        }
        
        if (foundCourse) {
          setCourse(foundCourse);
          
          // Mock materials
          const mockMaterials: Material[] = [
            {
              id: 1,
              courseId: foundCourse.id,
              name: "Introduction to Algorithms.pdf",
              type: "pdf",
              path: "/uploads/pdfs/intro-algorithms.pdf",
              uploadDate: new Date().toISOString()
            },
            {
              id: 2,
              courseId: foundCourse.id,
              name: "Lecture 1 - Programming Basics.mp3",
              type: "audio",
              path: "/uploads/audio/lecture-1.mp3",
              uploadDate: new Date().toISOString()
            }
          ];
          
          setMaterials(mockMaterials);
        } else {
          toast({
            title: "Course not found",
            description: "The course you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate("/professor/courses");
        }
      } catch (error) {
        console.error("Error loading course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, toast, navigate]);
  
  // Update materials when localStorage materials_added changes
  useEffect(() => {
    const materialsAdded = localStorage.getItem('materials_added');
    if (materialsAdded) {
      try {
        const newMaterials = JSON.parse(materialsAdded) as Material[];
        if (Array.isArray(newMaterials) && newMaterials.length > 0) {
          // Filter materials for this course only
          const courseMaterials = newMaterials.filter(m => m.courseId === courseId);
          if (courseMaterials.length > 0) {
            // Add new materials to the current list
            setMaterials(prev => [...prev, ...courseMaterials]);
            
            // Update the course's material count
            if (course) {
              setCourse({
                ...course,
                materialCount: (course.materialCount || 0) + courseMaterials.length
              });
            }
          }
        }
      } catch (e) {
        console.error("Error parsing materials data", e);
      }
    }
  }, [courseId, course]);
  
  // Handlers
  const handleUploadMaterials = () => {
    setUploadMaterialsModalOpen(true);
  };
  
  const handleViewMaterial = (material: Material) => {
    // Extract filename from path
    const filename = material.path.split('/').pop();
    window.open(`/api/uploads/${material.type}/${filename}`, "_blank");
  };
  
  const handleDeleteMaterial = (material: Material) => {
    toast({
      title: "Not implemented",
      description: "Material deletion is not yet implemented.",
    });
  };
  
  const copyAccessCode = () => {
    if (course?.accessCode) {
      navigator.clipboard.writeText(course.accessCode);
      toast({
        title: "Access code copied!",
        description: "The access code has been copied to your clipboard.",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex dashboard-content">
          <SideNav />
          <main className="flex-1 flex items-center justify-center">
            <p>Loading course details...</p>
          </main>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex dashboard-content">
          <SideNav />
          <main className="flex-1 flex items-center justify-center">
            <p>Course not found.</p>
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
              onClick={() => navigate("/professor/courses")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
                <p className="text-gray-600">{course.description}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Button variant="outline" onClick={() => navigate(`/professor/reports/${course.id}`)}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Course Reports
                </Button>
                <Button onClick={handleUploadMaterials}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Materials
                </Button>
              </div>
            </div>
          </div>
          
          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-xl font-bold">{course.studentCount || 0}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Materials</p>
                  <p className="text-xl font-bold">{course.materialCount || 0}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Access Code</p>
                  <div className="flex items-center">
                    <code className="text-xl font-mono font-bold">{course.accessCode}</code>
                    <Button variant="ghost" size="sm" onClick={copyAccessCode} className="ml-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="materials" className="space-y-4">
            <TabsList>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="settings">Course Settings</TabsTrigger>
            </TabsList>
            
            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Course Materials</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleUploadMaterials}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New
                  </Button>
                </CardHeader>
                <CardContent>
                  {materials.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
                      <p className="text-gray-500 mb-4">Upload PDF documents or audio files for your students.</p>
                      <Button onClick={handleUploadMaterials}>Upload Materials</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {materials.map(material => (
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
            </TabsContent>
            
            {/* Students Tab */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Students will appear here</h3>
                    <p className="text-gray-500 mb-4">Share your course access code with students to join.</p>
                    <Button onClick={copyAccessCode}>
                      <Clipboard className="h-4 w-4 mr-2" />
                      Copy Access Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-500">Course settings functionality coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Modals */}
      <UploadMaterialsModal
        open={uploadMaterialsModalOpen}
        onOpenChange={setUploadMaterialsModalOpen}
        preselectedCourseId={courseId}
        onUploadComplete={() => {
          // This would normally trigger a refetch
          // For our demo, useEffect monitors localStorage changes
        }}
      />
    </div>
  );
};

export default CourseDetail;