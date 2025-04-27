import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "./types";
import { getCurrentUser, logoutUser } from "./auth";

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

  const clearUser = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
