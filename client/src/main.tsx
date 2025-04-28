import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "./lib/user-context";

// Global debug functions for API testing in browser console
declare global {
  interface Window {
    debugApi: {
      testProfessorCourses: () => Promise<any>;
      getUserInfo: () => Promise<any>;
      checkAuth: () => Promise<any>;
      testDatabaseConnection: () => Promise<any>;
    }
  }
}

window.debugApi = {
  testProfessorCourses: async () => {
    console.log("DEBUG: Testing /api/professor/courses endpoint...");
    try {
      const response = await fetch('/api/professor/courses', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      console.log("DEBUG: Response status:", response.status, response.statusText);
      if (!response.ok) {
        console.error("DEBUG: Error response:", await response.text());
        return null;
      }
      const data = await response.json();
      console.log("DEBUG: Courses data:", data);
      return data;
    } catch (error) {
      console.error("DEBUG: Request failed:", error);
      return null;
    }
  },
  
  getUserInfo: async () => {
    console.log("DEBUG: Fetching user info...");
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      console.log("DEBUG: User response status:", response.status);
      if (!response.ok) {
        console.error("DEBUG: User error response:", await response.text());
        return null;
      }
      const data = await response.json();
      console.log("DEBUG: User data:", data);
      return data;
    } catch (error) {
      console.error("DEBUG: User request failed:", error);
      return null;
    }
  },
  
  checkAuth: async () => {
    console.log("DEBUG: Checking authentication state...");
    try {
      const userInfo = await window.debugApi.getUserInfo();
      if (!userInfo) {
        console.log("DEBUG: Not authenticated");
        return false;
      }
      console.log("DEBUG: Authenticated as:", userInfo.username, "Role:", userInfo.role);
      return userInfo.role === "professor";
    } catch (error) {
      console.error("DEBUG: Auth check failed:", error);
      return false;
    }
  },
  
  testDatabaseConnection: async () => {
    console.log("DEBUG: Testing database connection...");
    try {
      const response = await fetch('/api/debug/database', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      console.log("DEBUG: Database connection test status:", response.status);
      if (!response.ok) {
        console.error("DEBUG: Database test failed:", await response.text());
        return null;
      }
      const data = await response.json();
      console.log("DEBUG: Database test result:", data);
      return data;
    } catch (error) {
      console.error("DEBUG: Database test request failed:", error);
      return null;
    }
  }
};

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <App />
  </UserProvider>
);
