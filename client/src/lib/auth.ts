import { apiRequest } from "./queryClient";
import { User } from "./types";

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
    
    return await response.json();
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
    
    return await response.json();
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
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to logout. Please try again.");
  }
}

/**
 * Fetches the current authenticated user's information
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest("GET", "/api/auth/me", undefined);
    return await response.json();
  } catch (error) {
    // If 401 or other auth error, just return null instead of throwing
    console.log("Not authenticated or error fetching user:", error);
    return null;
  }
}
