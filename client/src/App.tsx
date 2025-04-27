import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useUser } from "./lib/user-context";
import { User } from "./lib/types";

// Import pages
import SimpleAuth from "@/pages/SimpleAuth";
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
  const { user, isLoading, setUser } = useUser();
  const [location, setLocation] = useLocation();

  // TEMPORARY: Create a demo user for testing
  useEffect(() => {
    if (!user) {
      const demoUser: User = {
        id: 1,
        username: "professor@example.com",
        name: "Demo Professor",
        role: "professor", 
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      
      // Automatically redirect to the professor dashboard for testing
      if (location === "/" || location === "/auth") {
        setLocation("/professor/dashboard");
      }
    }
  }, []);

  // We'll keep this simple for now
  const isProtectedRoute = 
    location.startsWith("/professor/") || 
    location.startsWith("/student/");
  
  const isPublicRoute = 
    location === "/" || 
    location === "/auth";

  return (
    <Switch>
      {/* Auth route */}
      <Route path="/auth" component={SimpleAuth} />
      
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
