import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser } from "./lib/user-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the ProtectedRoute component directly in App.tsx to avoid import issues
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'professor' | 'student' }) {
  const { user, isLoading } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is not authenticated
    if (!isLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access this page',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // If requiredRole is specified, check if user has that role
    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      toast({
        title: 'Access Denied',
        description: `You need ${requiredRole} privileges to access this page`,
        variant: 'destructive',
      });
      // Redirect to appropriate dashboard based on user role
      navigate(user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard');
    }
  }, [user, isLoading, requiredRole, navigate, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth required message if not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in to access this page.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated and has the required role, show children
  return <>{children}</>;
}

// Import layout components
import Navbar from "@/components/layout/Navbar";
import LandingPage from "@/components/layout/LandingPage";

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
  const { user, isLoading } = useUser();
  const [location, setLocation] = useLocation();
  const [showNavbar, setShowNavbar] = useState(false);

  // Check if we should show navbar (not on landing page or auth)
  useEffect(() => {
    const noNavbarRoutes = ['/', '/auth'];
    const showNavbarRoutes = ['/ai-tutor-demo']; // Routes where we want navbar even when not logged in
    
    if (showNavbarRoutes.includes(location)) {
      setShowNavbar(true);
    } else {
      setShowNavbar(!noNavbarRoutes.includes(location));
    }
  }, [location]);

  // Redirect to auth page if not logged in and handle role-based access
  useEffect(() => {
    // List of public routes that don't require authentication
    const publicRoutes = ['/', '/auth', '/ai-tutor-demo'];
    
    if (!isLoading) {
      console.log("Navigation check - User:", user?.username, "Role:", user?.role, "Location:", location);
      
      if (!user && !publicRoutes.includes(location)) {
        // Redirect to auth page if trying to access protected routes
        console.log("Redirecting to auth page - not authenticated");
        setLocation("/auth");
      } else if (user) {
        // Handle role-based redirections
        const isProfessorRoute = location.startsWith('/professor');
        const isStudentRoute = location.startsWith('/student');
        
        if (location === '/auth' || location === '/') {
          // Redirect from auth/home page if already logged in
          if (user.role === 'professor') {
            console.log("Redirecting professor to dashboard");
            setLocation("/professor/dashboard");
          } else {
            console.log("Redirecting student to dashboard");
            setLocation("/student/dashboard");
          }
        }
        // Redirect if user is trying to access pages for the wrong role
        else if (isProfessorRoute && user.role !== 'professor') {
          console.log("Access denied - redirecting student from professor page");
          setLocation("/student/dashboard");
        } else if (isStudentRoute && user.role !== 'student') {
          console.log("Access denied - redirecting professor from student page");
          setLocation("/professor/dashboard");
        }
      }
    }
  }, [user, isLoading, location, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      {/* Add padding for navbar on non-landing pages */}
      <main className={`flex-1 ${showNavbar ? 'pt-16' : ''}`}>
        <Switch>
          {/* Auth route */}
          <Route path="/auth" component={SimpleAuth} />
          
          {/* Professor routes - all wrapped with ProtectedRoute component */}
          <Route path="/professor/dashboard">
            <ProtectedRoute requiredRole="professor">
              <ProfessorDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/professor/courses">
            <ProtectedRoute requiredRole="professor">
              <ProfessorCourses />
            </ProtectedRoute>
          </Route>
          <Route path="/professor/courses/:id">
            <ProtectedRoute requiredRole="professor">
              <ProfessorCourseDetail />
            </ProtectedRoute>
          </Route>
          <Route path="/professor/courses/:id/analytics">
            <ProtectedRoute requiredRole="professor">
              {(() => {
                const CourseAnalytics = lazy(() => import('./pages/professor/CourseAnalytics'));
                return (
                  <Suspense fallback={<div>Loading analytics...</div>}>
                    <CourseAnalytics />
                  </Suspense>
                );
              })()}
            </ProtectedRoute>
          </Route>
          <Route path="/professor/materials">
            <ProtectedRoute requiredRole="professor">
              <ProfessorMaterials />
            </ProtectedRoute>
          </Route>
          <Route path="/professor/reports">
            <ProtectedRoute requiredRole="professor">
              <ProfessorReports />
            </ProtectedRoute>
          </Route>
          <Route path="/professor/reports/:id">
            <ProtectedRoute requiredRole="professor">
              <ProfessorReports />
            </ProtectedRoute>
          </Route>
          
          {/* Student routes - all wrapped with ProtectedRoute component */}
          <Route path="/student/dashboard">
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/student/course/:id/chat">
            <ProtectedRoute requiredRole="student">
              <StudentCourseChat />
            </ProtectedRoute>
          </Route>
          <Route path="/student/course/:id/materials">
            <ProtectedRoute requiredRole="student">
              <StudentCourseMaterials />
            </ProtectedRoute>
          </Route>
          <Route path="/student/chat-history">
            <ProtectedRoute requiredRole="student">
              <StudentChatHistory />
            </ProtectedRoute>
          </Route>
          
          {/* Course routes */}
          <Route path="/courses/:courseId/modules" component={() => {
            const CourseModules = lazy(() => import('./pages/course/Modules'));
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <CourseModules />
              </Suspense>
            );
          }} />
          
          <Route path="/courses/:courseId/modules/:moduleId/items/:itemId" component={() => {
            const ModuleDetail = lazy(() => import('./pages/course/ModuleDetail'));
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <ModuleDetail />
              </Suspense>
            );
          }} />
          
          {/* Landing page - Use our new LandingPage component */}
          {/* Demo route - direct access to AI chatbot demo */}
          <Route path="/ai-tutor-demo">
            {() => {
              const ModuleDetail = lazy(() => import('./pages/course/ModuleDetail'));
              return (
                <Suspense fallback={<div>Loading AI Tutor Demo...</div>}>
                  <ModuleDetail />
                </Suspense>
              );
            }}
          </Route>
          
          <Route path="/">
            <LandingPage />
          </Route>
          
          {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  // Add theme toggle capability
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Check if user has saved preference or use system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('color-theme');
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme to document
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [isDarkTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen">
          <Toaster />
          <Router />
          
          {/* Theme toggle button fixed in corner */}
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="fixed right-4 bottom-4 p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 shadow-lg z-50"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
          >
            {isDarkTheme ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
