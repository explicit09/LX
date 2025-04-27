import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useUser } from "./lib/user-context";

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
    setShowNavbar(!noNavbarRoutes.includes(location));
  }, [location]);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!user && !isLoading && location !== "/" && location !== "/auth") {
      // Redirect to auth page if trying to access protected routes
      setLocation("/auth");
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
          
          {/* Course routes */}
          <Route path="/courses/:courseId/modules" component={() => {
            const CourseModules = React.lazy(() => import('./pages/course/Modules'));
            return (
              <React.Suspense fallback={<div>Loading...</div>}>
                <CourseModules />
              </React.Suspense>
            );
          }} />
          
          <Route path="/courses/:courseId/modules/:moduleId/items/:itemId" component={() => {
            const ModuleDetail = React.lazy(() => import('./pages/course/ModuleDetail'));
            return (
              <React.Suspense fallback={<div>Loading...</div>}>
                <ModuleDetail />
              </React.Suspense>
            );
          }} />
          
          {/* Landing page - Use our new LandingPage component */}
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
