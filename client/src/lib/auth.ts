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
    // Get the current user from the API
    try {
      const response = await apiRequest("GET", "/api/user", undefined);
      const user = await response.json();
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    } catch (err) {
      // If API call fails, just proceed with null
      console.log("API call to get current user failed:", err);
      // Clear localStorage if API call fails (user logged out)
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    
    return null;
  } catch (error) {
    // If 401 or other auth error, just return null instead of throwing
    console.log("Not authenticated or error fetching user:", error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}
