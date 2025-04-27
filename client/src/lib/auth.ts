import { apiRequest } from "./queryClient";
import { User } from "./types";

// Storage key for persistent authentication
const AUTH_STORAGE_KEY = 'eduquest_user';

/**
 * Authenticates a user with the provided credentials
 */
export async function loginUser(username: string, password: string, role: "professor" | "student"): Promise<User> {
  try {
    const response = await apiRequest("POST", "/api/auth/login", {
      username,
      password,
      role
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
    const response = await apiRequest("POST", "/api/auth/register", {
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
    await apiRequest("POST", "/api/auth/logout", {});
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
    // Try to get from local storage first
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as User;
    }
    
    // For demo purposes, we'll just return null here instead of hitting the server
    // In a real app, this would make an API call to get the current user
    // const response = await apiRequest("GET", "/api/auth/me", undefined);
    // const user = await response.json();
    // if (user) {
    //   localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // }
    
    return null;
  } catch (error) {
    // If 401 or other auth error, just return null instead of throwing
    console.log("Not authenticated or error fetching user:", error);
    return null;
  }
}

/**
 * For demo purposes, create a demo user without hitting the backend
 */
export function createDemoUser(role: "professor" | "student" = "professor"): User {
  const user: User = {
    id: 1,
    username: role === "professor" ? "professor@eduquest.com" : "student@eduquest.com",
    name: role === "professor" ? "Demo Professor" : "Demo Student",
    role: role,
    createdAt: new Date().toISOString()
  };
  
  // Save to local storage
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  
  return user;
}
