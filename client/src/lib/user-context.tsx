import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "./types";
import { getCurrentUser, logoutUser } from "./auth";
import { useLocation } from "wouter";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: async () => {},
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  // Load user on mount and set up refresh interval
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser); // Set to null if not authenticated
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null); // Ensure user is set to null on error
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadUser();
    
    // Set up periodic refresh (every 3 minutes)
    const refreshInterval = setInterval(() => {
      console.log("Refreshing user authentication state...");
      loadUser();
    }, 180000); // 3 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const clearUser = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // We no longer need the navigateToDashboard function
  // We're using direct browser navigation instead

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      clearUser, 
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
