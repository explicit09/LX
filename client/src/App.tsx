import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useUser } from "./lib/user-context";

// Import pages
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";

// Professor pages
import ProfessorDashboard from "@/pages/professor/Dashboard";
import ProfessorCourses from "@/pages/professor/Courses";
import ProfessorMaterials from "@/pages/professor/Materials";
import ProfessorReports from "@/pages/professor/Reports";

// Student pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentCourseChat from "@/pages/student/CourseChat";
import StudentChatHistory from "@/pages/student/ChatHistory";

function Router() {
  const { user, isLoading } = useUser();
  const [location, setLocation] = useLocation();

  const isProtectedRoute = 
    location.startsWith("/professor/") || 
    location.startsWith("/student/");
  
  const isPublicRoute = 
    location === "/" || 
    location === "/auth";
  
  useEffect(() => {
    if (!isLoading) {
      // Redirect to auth if trying to access protected route while not logged in
      if (!user && isProtectedRoute) {
        setLocation("/auth");
      }
      
      // If logged in and on auth page, redirect to dashboard
      if (user && location === "/auth") {
        setLocation(user.role === "professor" ? "/professor/dashboard" : "/student/dashboard");
      }
    }
  }, [user, isLoading, location, setLocation, isProtectedRoute]);

  if (isLoading && isProtectedRoute) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      {/* Auth route */}
      <Route path="/auth" component={Auth} />
      
      {/* Professor routes */}
      <Route path="/professor/dashboard" component={ProfessorDashboard} />
      <Route path="/professor/courses" component={ProfessorCourses} />
      <Route path="/professor/materials" component={ProfessorMaterials} />
      <Route path="/professor/reports" component={ProfessorReports} />
      
      {/* Student routes */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/course/:id/chat" component={StudentCourseChat} />
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
