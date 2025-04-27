import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useUser } from "./lib/user-context";

// Import pages
import SimpleAuth from "@/pages/SimpleAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";

// Professor pages
import ProfessorDashboard from "@/pages/professor/Dashboard";
import ProfessorCourses from "@/pages/professor/Courses";
import ProfessorCourseDetail from "@/pages/professor/CourseDetail";
import ProfessorMaterials from "@/pages/professor/Materials";
import ProfessorReports from "@/pages/professor/Reports";

// Student pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentCourseChat from "@/pages/student/CourseChat";
import StudentCourseMaterials from "@/pages/student/CourseMaterials";
import StudentChatHistory from "@/pages/student/ChatHistory";

function Router() {
  const { user, isLoading, createDummyUser } = useUser();
  const [location, setLocation] = useLocation();

  // Create demo user for easier testing
  useEffect(() => {
    if (!user && !isLoading) {
      // Create a demo professor account
      createDummyUser("professor");
      
      // Route to professor dashboard
      if (location === "/" || location === "/auth") {
        setLocation("/professor/dashboard");
      }
    }
  }, [user, isLoading, location, setLocation, createDummyUser]);

  return (
    <Switch>
      {/* Auth route */}
      <Route path="/auth" component={SimpleAuth} />
      
      {/* Professor routes */}
      <Route path="/professor/dashboard" component={ProfessorDashboard} />
      <Route path="/professor/courses" component={ProfessorCourses} />
      <Route path="/professor/courses/:id" component={ProfessorCourseDetail} />
      <Route path="/professor/materials" component={ProfessorMaterials} />
      <Route path="/professor/reports" component={ProfessorReports} />
      <Route path="/professor/reports/:id" component={ProfessorReports} />
      
      {/* Student routes */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/course/:id/chat" component={StudentCourseChat} />
      <Route path="/student/course/:id/materials" component={StudentCourseMaterials} />
      <Route path="/student/chat-history" component={StudentChatHistory} />
      
      {/* Landing page */}
      <Route path="/" component={Landing} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
