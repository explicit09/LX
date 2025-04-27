import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "./types";
import { getCurrentUser, createDemoUser } from "./auth";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isLoading: boolean;
  createDummyUser: (role: "professor" | "student") => User;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
  isLoading: true,
  createDummyUser: () => ({} as User),
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearUser = () => {
    localStorage.removeItem('eduquest_user');
    setUser(null);
  };
  
  // Create a dummy user for testing without hitting the backend
  const createDummyUser = (role: "professor" | "student" = "professor"): User => {
    const dummyUser = createDemoUser(role);
    setUser(dummyUser);
    return dummyUser;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      clearUser, 
      isLoading,
      createDummyUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
