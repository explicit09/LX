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
      createTestCourse: (professorId: number) => Promise<any>;
      getTableCounts: () => Promise<any>;
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
  },
  
  createTestCourse: async (professorId: number) => {
    console.log(`DEBUG: Creating test course for professor ID ${professorId}...`);
    try {
      // Use XMLHttpRequest to avoid Vite intercepting the request
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/debug/createcourse/${professorId}`);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log("DEBUG: Test course created:", data);
              resolve(data);
            } catch (e) {
              console.error("DEBUG: Error parsing JSON response:", xhr.responseText);
              reject(new Error("Invalid JSON response"));
            }
          } else {
            console.error("DEBUG: Error creating test course:", xhr.status, xhr.statusText);
            reject(new Error(`Request failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = function() {
          console.error("DEBUG: Network error creating test course");
          reject(new Error("Network error"));
        };
        xhr.send();
      });
    } catch (error) {
      console.error("DEBUG: Test course creation failed:", error);
      return null;
    }
  },
  
  getTableCounts: async () => {
    console.log("DEBUG: Getting table counts...");
    try {
      // Use XMLHttpRequest to avoid Vite intercepting the request
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/debug/table-counts');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log("DEBUG: Table counts:", data);
              resolve(data);
            } catch (e) {
              console.error("DEBUG: Error parsing JSON response:", xhr.responseText);
              reject(new Error("Invalid JSON response"));
            }
          } else {
            console.error("DEBUG: Error getting table counts:", xhr.status, xhr.statusText);
            reject(new Error(`Request failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = function() {
          console.error("DEBUG: Network error getting table counts");
          reject(new Error("Network error"));
        };
        xhr.send();
      });
    } catch (error) {
      console.error("DEBUG: Get table counts failed:", error);
      return null;
    }
  }
};

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <App />
  </UserProvider>
);
