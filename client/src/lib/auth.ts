import { apiRequest } from "./queryClient";
import { User } from "./types";

// Storage key for persistent authentication
const AUTH_STORAGE_KEY = 'learnx_user';

/**
 * Authenticates a user with the provided credentials
 */
export async function loginUser(username: string, password: string): Promise<User> {
  try {
    const response = await apiRequest("POST", "/api/login", {
      username,
      password
    });
    
    const user = await response.json();
    // Save to local storage for persistence
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to login. Please check your credentials and try again.");
  }
}

/**
 * Registers a new user with the provided information
 */
export async function registerUser(
  name: string, 
  username: string, 
  password: string, 
  role: "professor" | "student"
): Promise<User> {
  try {
    const response = await apiRequest("POST", "/api/register", {
      name,
      username,
      password,
      role
    });
    
    const user = await response.json();
    // Save to local storage for persistence
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to register. This username may already be taken.");
  }
}

/**
 * Logs out the current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiRequest("POST", "/api/logout", {});
    // Remove from local storage
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove from local storage even if server logout fails
    localStorage.removeItem(AUTH_STORAGE_KEY);
    throw new Error("Failed to logout. Please try again.");
  }
}

/**
 * Fetches the current authenticated user's information
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // First check if we have a cached user in localStorage
    const cachedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    let parsedUser: User | null = null;
    
    if (cachedUser) {
      try {
        parsedUser = JSON.parse(cachedUser) as User;
        console.log("Found cached user:", parsedUser.username);
      } catch (e) {
        console.error("Failed to parse cached user:", e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    
    // Always verify with the server
    try {
      const response = await apiRequest("GET", "/api/user", undefined);
      
      // If unauthorized (401), clear cached user and return null
      if (response.status === 401) {
        console.log("Server reports user is not authenticated (401)");
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }
      
      // If the request was successful, parse and return the user
      if (response.ok) {
        const serverUser = await response.json();
        console.log("Server confirmed authenticated user:", serverUser.username);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(serverUser));
        return serverUser;
      }
      
      // For other error statuses
      console.error("Unexpected status from /api/user:", response.status);
      
      // Fall back to cached user if we have one and not 401
      if (parsedUser) {
        console.log("Falling back to cached user due to server error");
        return parsedUser;
      }
      
      return null;
    } catch (networkErr) {
      console.error("Network error when fetching current user:", networkErr);
      
      // If offline/network error, use cached user if available
      if (parsedUser) {
        console.log("Network error, using cached user");
        return parsedUser;
      }
      
      return null;
    }
  } catch (error) {
    // Catch any other errors
    console.error("Unexpected error in getCurrentUser:", error);
    return null;
  }
}
