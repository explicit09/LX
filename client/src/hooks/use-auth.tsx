import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (name: string, username: string, password: string, role: 'professor' | 'student') => Promise<User>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/user");
        
        // If the request is successful but returns 401, the response.ok will be false
        if (!response.ok) {
          if (response.status === 401) {
            // User is not authenticated, but this is not an error
            setUser(null);
            return;
          }
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/login", { username, password });
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/logout");
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, username: string, password: string, role: 'professor' | 'student'): Promise<User> => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/register", { name, username, password, role });
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        setUser,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}