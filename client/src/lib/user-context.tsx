import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "./types";
import { getCurrentUser } from "./auth";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
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
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
